import React, { useState, useMemo, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Modal,
  Platform,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "@clerk/clerk-expo";

import BottomNavBar from "../components/BottomNavBar";
import TeamDetailSheet from "./TeamDetailSheet";

/**
 * Robust logo fallback system.
 * If the database doesn't have a URL, we generate a high-res ESPN CDN URL.
 */
const getTeamLogo = (sport: string, abbr: string, fallbackUrl?: string) => {
  if (fallbackUrl) return fallbackUrl;
  if (!abbr) return null;
  
  const sportSlug = sport.toLowerCase();
  let teamSlug = abbr.toLowerCase();
  
  // NBA Fixes
  if (sport === 'NBA') {
    if (teamSlug === 'gs') teamSlug = 'gsw';
    if (teamSlug === 'la') teamSlug = 'lal';
    if (teamSlug === 'ny') teamSlug = 'ny';
    if (teamSlug === 'no') teamSlug = 'no';
    if (teamSlug === 'uta') teamSlug = 'utah';
  }
  
  // NHL Fixes
  if (sport === 'NHL') {
    if (teamSlug === 'la') teamSlug = 'lak';
    if (teamSlug === 'tb') teamSlug = 'tbl';
    if (teamSlug === 'nj') teamSlug = 'njd';
  }
  
  return `https://a.espncdn.com/i/teamlogos/${sportSlug}/500/${teamSlug}.png`;
};

const { width } = Dimensions.get("window");

const SPORTS = ["All", "NFL", "NBA", "MLB", "NHL", "GOLF"];

const getNext7Days = () => {
  const days = [];
  const today = new Date();
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const isToday = i === 0;
    
    days.push({
      id: dateStr,
      label: isToday ? "TODAY" : dayNames[d.getDay()],
      subLabel: `${monthNames[d.getMonth()]} ${d.getDate()}`,
      fullDate: dateStr,
    });
  }
  return days;
};

const LiveGamesScreen = ({ navigation }) => {
  const daysString = useMemo(() => getNext7Days(), []);
  
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(daysString[0].fullDate);
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  
  // Read favorite teams from Clerk metadata
  const favoriteTeams = (user?.unsafeMetadata?.favoriteTeams as Record<string, string[]>) ?? {};

  // Helper: does this game feature a favorite team?
  const isFavoriteGame = (game: any): boolean => {
    const sport = game.sport;
    const favs = favoriteTeams[sport] ?? [];
    if (favs.length === 0) return false;
    return (
      favs.includes(game.awayTeam?.abbr) ||
      favs.includes(game.homeTeam?.abbr)
    );
  };

  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedTeamDetail, setSelectedTeamDetail] = useState<null | {
    team: any; sport: string; opponent?: any; gameStatus?: string; startsAt?: string;
  }>(null);
  const [showTVGuide, setShowTVGuide] = useState(false);
  const [listPage, setListPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Main query: ALL games for selected date (live, closed, scheduled)
  const allGamesForDate = useQuery(api.sports_queries.getGamesForDate, {
    targetDate: selectedDate,
    sportFilter: selectedSport,
  });
  const allTeamsBySport = useQuery(api.sports_queries.getUniqueTeams);

  // Carousel: uses same data, filtered by sport already
  const carouselGames = useMemo(() => {
    if (!allGamesForDate) return [];
    
    // Use a Map to ensure uniqueness by ID
    const uniqueGames = new Map();
    
    // Priority 1: Live games
    const live = allGamesForDate.filter(g => g.status === 'inprogress');
    live.forEach(g => uniqueGames.set(g._id, g));
    
    // Priority 2: Prime Time games
    const prime = allGamesForDate.filter(g => g.isPrimeTime && g.status !== 'inprogress');
    prime.forEach(g => {
        if (uniqueGames.size < 10) uniqueGames.set(g._id, g);
    });
    
    // Fallback: Fill with upcoming/closed games if carousel is too small
    if (uniqueGames.size < 5) {
        const others = allGamesForDate.filter(g => !uniqueGames.has(g._id));
        others.slice(0, 5 - uniqueGames.size).forEach(g => uniqueGames.set(g._id, g));
    }
    
    return Array.from(uniqueGames.values());
  }, [allGamesForDate]);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<FlatList>(null);

  const majorLeagues = ["NFL", "NBA", "MLB", "NHL"];

  const groupedGames = useMemo(() => {
    if (!allGamesForDate) return {};
    
    // Apply team filter, then paginate
    const teamFiltered = selectedTeam
      ? allGamesForDate.filter((g: any) =>
          g.awayTeam?.abbr === selectedTeam || g.homeTeam?.abbr === selectedTeam
        )
      : allGamesForDate;
    const paginated = teamFiltered.slice(0, listPage * ITEMS_PER_PAGE);

    const groups = {};
    
    // Initialize groups for current sport or all major leagues if "All" is selected
    if (selectedSport !== "All") {
        groups[selectedSport] = [];
    } else {
        majorLeagues.forEach(l => groups[l] = []);
    }

    paginated.forEach(game => {
      const sport = game.sport || "OTHER";
      if (!groups[sport]) groups[sport] = [];
      groups[sport].push(game);
    });

    // Priority Sort within each group
    Object.keys(groups).forEach(sport => {
        groups[sport].sort((a, b) => {
            const aFav = isFavoriteGame(a) ? 1 : 0;
            const bFav = isFavoriteGame(b) ? 1 : 0;
            return bFav - aFav;
        });
    });

    return groups;
  }, [allGamesForDate, selectedSport, listPage, selectedTeam]);

  const getSportColor = (sport) => {
      switch(sport) {
          case 'NBA': return '#FF6B00';
          case 'MLB': return '#E31837';
          case 'NFL': return '#013369';
          case 'NHL': return '#A2AAAD';
          case 'GOLF': return '#2d6a4f';
          default: return '#FFA500';
      }
  };

  const getSportIcon = (sport) => {
      switch(sport) {
          case 'NBA': return 'basketball';
          case 'MLB': return 'baseball';
          case 'NFL': return 'american-football';
          case 'NHL': return 'snow';
          case 'GOLF': return 'golf';
          default: return 'trophy';
      }
  };

  const isSportInSeason = (sport) => {
    const month = new Date().getMonth(); // 0-11 (April = 3)
    switch (sport) {
      case "NFL":
        return month >= 7 || month <= 1; // Aug - Feb
      case "NBA":
      case "NHL":
        return month >= 9 || month <= 5; // Oct - June
      case "MLB":
        return month >= 1 && month <= 10; // Feb - Nov
      case "GOLF":
        return true;
      default:
        return true;
    }
  };


  const renderLeagueSection = (sport, games) => {
    const accentColor = getSportColor(sport);
    const hasGames = games && games.length > 0;
    const isMajor = majorLeagues.includes(sport);
    const inSeason = isSportInSeason(sport);

    // If "All" tab: Only show empty sections if it's the actual off-season
    // Wait, we DO want to show empty sections if it's "All" tab so it doesn't look totally blank,
    // but we need the correct copy.
    if (!hasGames && selectedSport !== "All" && !isMajor) return null;
    if (!hasGames && selectedSport === "All" && !inSeason && sport !== "NFL") return null; 
    // Always keep NFL empty state if off-season as requested by user, hide others if "All" to save space?
    // Actually, just show the appropriate message:
    if (!hasGames && !isMajor && selectedSport === "All") return null;

    return (
        <View key={sport} style={styles.leagueSection}>
            <View style={styles.leagueHeaderLine}>
                <View style={styles.leagueHeaderLabelSide}>
                    <View style={[styles.leagueAccentPill, { backgroundColor: hasGames ? accentColor : '#333' }]} />
                    <Ionicons 
                        name={getSportIcon(sport)} 
                        size={14} 
                        color={hasGames ? accentColor : '#666'} 
                    />
                    <Text style={[styles.leagueHeaderTitle, !hasGames && { color: '#666' }]}>{sport} {sport === 'GOLF' ? 'TOUR' : 'LEAGUE'}</Text>
                </View>
                <View style={styles.leagueRightSide}>
                    <Text style={styles.leagueGameCount}>{hasGames ? `${games.length} GAMES` : inSeason ? 'NO GAMES TODAY' : 'OFF SEASON'}</Text>
                    <View style={[styles.leagueAccentPill, { backgroundColor: hasGames ? accentColor : '#333', marginLeft: 10 }]} />
                </View>
            </View>
            {hasGames ? (
                games.map((game: any) => (
                    <View key={game._id || game.id}>
                        {renderListGame({ item: game })}
                    </View>
                ))
            ) : (
                <View style={[styles.offSeasonCard, !inSeason && { opacity: 0.7 }]}>
                    <Text style={styles.offSeasonTitle}>
                      {inSeason ? `NO ${sport} GAMES SCHEDULED FOR THIS DATE` : `${sport} IS CURRENTLY IN THE OFF-SEASON`}
                    </Text>
                    <Text style={styles.offSeasonSub}>
                      {inSeason ? "TRY SELECTING ANOTHER DATE FROM THE CALENDAR" : "STAY TUNED FOR SEASON OPENER UPDATES!"}
                    </Text>
                </View>
            )}
        </View>
    );
  };

  const renderGameCard = ({ item }) => {
    const isLive = item.status === "inprogress";
    const isFinal = item.status === "closed";
    const isTournament = item.sport === "GOLF" || !!item.tournamentName || (!item.awayTeam && !item.homeTeam);
    const sportColor = getSportColor(item.sport);
    
    return (
      <TouchableOpacity style={styles.heroCard} onPress={() => setSelectedGame(item)}>
        {/* Header: Sport Badge + Status */}
        <View style={styles.heroHeader}>
          <View style={styles.heroHeaderLeft}>
            <View style={[styles.sportBadge, { backgroundColor: sportColor }]}>
              <Text style={styles.sportBadgeText}>{item.sport}</Text>
            </View>
            {isFavoriteGame(item) && (
              <View style={styles.favBadge}>
                <Text style={styles.favBadgeText}>★ YOUR TEAM</Text>
              </View>
            )}
            {isLive && (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            )}
          </View>
          <Text style={styles.primeTimeLabelText}>
            {isLive ? "IN PROGRESS" : isFinal ? "FINAL" : "PRIMETIME MATCHUP"}
          </Text>
        </View>

        {isTournament ? (
            <View style={styles.tournamentBody}>
                <Ionicons name="trophy-outline" size={44} color="#FFA500" style={{ marginBottom: 10 }} />
                <Text style={styles.tournamentTitle} numberOfLines={2}>
                    {item.tournamentName || "Upcoming Tournament"}
                </Text>
            </View>
        ) : (
            <View style={styles.heroTeamsRow}>
              {/* Away Team */}
              <TouchableOpacity
                style={styles.heroTeamCol}
                onPress={() => setSelectedTeamDetail({
                  team: { ...item.awayTeam, logoUrl: getTeamLogo(item.sport, item.awayTeam?.abbr, item.awayTeam?.logoUrl) },
                  sport: item.sport,
                  opponent: { ...item.homeTeam, logoUrl: getTeamLogo(item.sport, item.homeTeam?.abbr, item.homeTeam?.logoUrl) },
                  gameStatus: item.status,
                  startsAt: item.startsAt,
                })}
              >
                <View style={styles.logoCircleLarge}>
                    {getTeamLogo(item.sport, item.awayTeam?.abbr, item.awayTeam?.logoUrl) ? (
                        <Image 
                            source={{ uri: getTeamLogo(item.sport, item.awayTeam?.abbr, item.awayTeam?.logoUrl) as string }} 
                            style={styles.heroLogoLarge} 
                            resizeMode="contain" 
                        />
                    ) : (
                        <Text style={styles.logoFallbackTextLarge}>{item.awayTeam?.abbr}</Text>
                    )}
                </View>
                <Text style={styles.heroTeamNameLarge} numberOfLines={1}>{item.awayTeam?.name?.toUpperCase() || "TBA"}</Text>
              </TouchableOpacity>
              
              {/* Center: Score or Time */}
              <View style={styles.heroCenterCol}>
                {(isLive || isFinal) ? (
                   <>
                     <Text style={styles.heroScoreLarge}>
                       {item.awayTeam?.score ?? item.awayTeam?.runs ?? "-"}
                     </Text>
                     <Text style={styles.heroScoreDividerLarge}>–</Text>
                     <Text style={styles.heroScoreLarge}>
                       {item.homeTeam?.score ?? item.homeTeam?.runs ?? "-"}
                     </Text>
                   </>
                ) : (
                   <>
                     <Text style={styles.heroTimeLarge}>
                       {new Date(item.startsAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                     </Text>
                     <Text style={styles.heroDateSub}>
                       {new Date(item.startsAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
                     </Text>
                     {item.dayNight && (
                       <Text style={styles.heroDayNight}>
                         {item.dayNight === 'D' ? '☀️ Day' : '🌙 Night'}
                       </Text>
                     )}
                   </>
                )}
              </View>

              {/* Home Team */}
              <TouchableOpacity
                style={styles.heroTeamCol}
                onPress={() => setSelectedTeamDetail({
                  team: { ...item.homeTeam, logoUrl: getTeamLogo(item.sport, item.homeTeam?.abbr, item.homeTeam?.logoUrl) },
                  sport: item.sport,
                  opponent: { ...item.awayTeam, logoUrl: getTeamLogo(item.sport, item.awayTeam?.abbr, item.awayTeam?.logoUrl) },
                  gameStatus: item.status,
                  startsAt: item.startsAt,
                })}
              >
                <View style={styles.logoCircleLarge}>
                    {getTeamLogo(item.sport, item.homeTeam?.abbr, item.homeTeam?.logoUrl) ? (
                        <Image 
                            source={{ uri: getTeamLogo(item.sport, item.homeTeam?.abbr, item.homeTeam?.logoUrl) as string }} 
                            style={styles.heroLogoLarge} 
                            resizeMode="contain" 
                        />
                    ) : (
                        <Text style={styles.logoFallbackTextLarge}>{item.homeTeam?.abbr}</Text>
                    )}
                </View>
                <Text style={styles.heroTeamNameLarge} numberOfLines={1}>{item.homeTeam?.name?.toUpperCase() || "TBA"}</Text>
              </TouchableOpacity>
            </View>
        )}
        
        {/* Footer */}
        <View style={styles.heroFooter}>
          <View style={styles.heroFooterLeft}>
            {item.venue?.name ? (
              <>
                <Ionicons name="location" size={11} color="#E31837" />
                <Text style={styles.heroFooterText}>{item.venue.name}, {item.venue.city}</Text>
              </>
            ) : (
              <Text style={styles.heroFooterText}>{item.broadcast || ''}</Text>
            )}
          </View>
          <Text style={styles.heroFooterTap}>TAP FOR DETAILS →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderListGame = ({ item }) => {
      const isLive = item.status === "inprogress";
      
      return (
          <TouchableOpacity style={styles.listCard} onPress={() => setSelectedGame(item)}>
              <View style={styles.cardContainer}>
                  {/* LEFT: TIME & BROADCAST */}
                  <View style={styles.listLeftCol}>
                    <Text style={styles.listTimeMain}>
                        {new Date(item.startsAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </Text>
                    <View style={styles.listSubInfoRow}>
                        <Ionicons name="tv-outline" size={10} color="#FFA500" />
                        <Text style={styles.listSubInfoText}>{item.broadcast || "SPEC"}</Text>
                    </View>
                    <View style={styles.listSubInfoRow}>
                        <Ionicons name="location-outline" size={10} color="#888" />
                        <Text style={styles.listSubInfoText} numberOfLines={1}>{item.venue?.abbr || "THE OB"}</Text>
                    </View>
                  </View>

                  {/* CENTER: MATCHUP */}
                  <View style={styles.listCenterCol}>
                      <TouchableOpacity
                        style={styles.listTeamUnit}
                        onPress={() => setSelectedTeamDetail({
                          team: { ...item.awayTeam, logoUrl: getTeamLogo(item.sport, item.awayTeam?.abbr, item.awayTeam?.logoUrl) },
                          sport: item.sport,
                          opponent: { ...item.homeTeam, logoUrl: getTeamLogo(item.sport, item.homeTeam?.abbr, item.homeTeam?.logoUrl) },
                          gameStatus: item.status,
                          startsAt: item.startsAt,
                        })}
                      >
                          <Text style={styles.listTeamAbbrMain}>{item.awayTeam?.abbr}</Text>
                          {getTeamLogo(item.sport, item.awayTeam?.abbr, item.awayTeam?.logoUrl) && (
                            <Image 
                                source={{ uri: getTeamLogo(item.sport, item.awayTeam?.abbr, item.awayTeam?.logoUrl) as string }} 
                                style={styles.listLogoMain} 
                                resizeMode="contain" 
                            />
                          )}
                      </TouchableOpacity>
                      <Text style={styles.listVersusText}>@</Text>
                      <TouchableOpacity
                        style={styles.listTeamUnit}
                        onPress={() => setSelectedTeamDetail({
                          team: { ...item.homeTeam, logoUrl: getTeamLogo(item.sport, item.homeTeam?.abbr, item.homeTeam?.logoUrl) },
                          sport: item.sport,
                          opponent: { ...item.awayTeam, logoUrl: getTeamLogo(item.sport, item.awayTeam?.abbr, item.awayTeam?.logoUrl) },
                          gameStatus: item.status,
                          startsAt: item.startsAt,
                        })}
                      >
                          {getTeamLogo(item.sport, item.homeTeam?.abbr, item.homeTeam?.logoUrl) && (
                            <Image 
                                source={{ uri: getTeamLogo(item.sport, item.homeTeam?.abbr, item.homeTeam?.logoUrl) as string }} 
                                style={styles.listLogoMain} 
                                resizeMode="contain" 
                            />
                          )}
                          <Text style={styles.listTeamAbbrMain}>{item.homeTeam?.abbr}</Text>
                      </TouchableOpacity>
                  </View>

                    {/* RIGHT: SCORE / STATUS */}
                  <View style={styles.listRightCol}>
                    {isFavoriteGame(item) && (
                      <View style={[styles.favBadge, { marginBottom: 8 }]}>
                        <Text style={styles.favBadgeText}>YOUR TEAM</Text>
                      </View>
                    )}
                    {(isLive || item.status === 'closed') && (
                      <View style={styles.liveScoreBlock}>
                        <Text style={styles.liveScoreNum}>
                          {item.awayTeam?.score ?? item.awayTeam?.runs ?? '—'}
                        </Text>
                        <Text style={styles.liveScoreDash}>–</Text>
                        <Text style={styles.liveScoreNum}>
                          {item.homeTeam?.score ?? item.homeTeam?.runs ?? '—'}
                        </Text>
                      </View>
                    )}
                    {item.status === 'closed' ? (
                      <View style={styles.finalBadgeSmall}>
                        <Text style={styles.finalBadgeText}>FINAL</Text>
                      </View>
                    ) : isLive ? (
                      <View style={styles.liveBadgeSmall}>
                        <View style={styles.liveDotSmall} />
                        <Text style={styles.liveBadgeSmallText}>LIVE</Text>
                      </View>
                    ) : (
                      <View style={styles.winProbContainer}>
                        <View style={[styles.winProbBar, { width: '60%', backgroundColor: '#222' }]} />
                        <Text style={styles.winProbText}>TBD</Text>
                      </View>
                    )}
                  </View>
              </View>
          </TouchableOpacity>
      )
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} />
      
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.navBack} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFA500" />
        </TouchableOpacity>
        
        <TouchableOpacity 
            style={styles.floatingTvBtn}
            onPress={() => setShowTVGuide(true)}
        >
            <Ionicons name="tv-outline" size={14} color="#000" />
            <Text style={styles.floatingTvBtnText}>BAR TV MAP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navLogo} onPress={() => navigation.navigate("LandingScreen")}>
          <Text style={styles.logoText}>#THEOB</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* VIDEO JUMBOTRON HERO */}
        <View style={styles.videoHeroContainer}>
            <Video 
                source={require("../../assets/videos/homerun-hero.mp4") as any}
                rate={1.0}
                volume={0}
                isMuted={true}
                resizeMode={"cover" as any}
                shouldPlay
                isLooping
                style={StyleSheet.absoluteFill}
            />
            {/* TEXT POP GRADIENT */}
            <LinearGradient 
                colors={['rgba(10,10,10,0.5)', 'rgba(10,10,10,0.3)', '#0a0a0a']} 
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.titleBlock}>
                <Text style={styles.mainTitle}>LIVE AT THE OB</Text>
                <Text style={styles.subTitle}>SCORE FRONT-ROW SEATS TO THE BIGGEST GAMES, FIGHTS, RACES AND MORE</Text>
                <Text style={styles.orangeCallout}>EVERY SEAT IS THE BEST SEAT IN THE HOUSE</Text>
            </View>
        </View>

        <View style={styles.contentWrap}>
            {/* Date Selector */}
            <View style={styles.dateSelectorSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
                    {daysString.map((d) => (
                        <TouchableOpacity 
                            key={d.id} 
                            style={[styles.dateBox, selectedDate === d.id && styles.dateBoxActive]}
                            onPress={() => setSelectedDate(d.id)}
                        >
                            <Text style={[styles.dateLabel, selectedDate === d.id && styles.dateLabelActive]}>{d.label}</Text>
                            <Text style={[styles.dateSub, selectedDate === d.id && styles.dateSubActive]}>{d.subLabel}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Sports Filter Pill Selector */}
            <View style={styles.filterSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {SPORTS.map(sport => (
                        <TouchableOpacity 
                            key={sport} 
                            style={[styles.filterPill, selectedSport === sport && styles.filterPillActive]}
                            onPress={() => {
                                setSelectedSport(sport);
                                setListPage(1);
                                setSelectedTeam(null);
                            }}
                        >
                            <Text style={[styles.filterText, selectedSport === sport && styles.filterTextActive]}>{sport.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Featured Games Carousel — always visible, all sports */}
            {carouselGames.length > 0 && (
                <View style={styles.primeTimeSection}>
                    <FlatList
                        ref={carouselRef}
                        data={carouselGames}
                        renderItem={renderGameCard}
                        keyExtractor={(item) => item._id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.carouselContent}
                        snapToInterval={width * 0.88 + 16}
                        decelerationRate="fast"
                        pagingEnabled={false}
                        onMomentumScrollEnd={(e) => {
                            const idx = Math.round(e.nativeEvent.contentOffset.x / (width * 0.88 + 16));
                            setCarouselIndex(idx);
                        }}
                        getItemLayout={(data, index) => ({
                            length: width * 0.88 + 16,
                            offset: (width * 0.88 + 16) * index,
                            index,
                        })}
                    />
                    {/* Carousel dots + arrows */}
                    {carouselGames.length > 1 && (
                      <View style={styles.carouselNav}>
                        <TouchableOpacity
                          style={[styles.carouselArrow, carouselIndex === 0 && styles.carouselArrowDisabled]}
                          onPress={() => {
                            const next = Math.max(0, carouselIndex - 1);
                            setCarouselIndex(next);
                            carouselRef.current?.scrollToIndex({ index: next, animated: true });
                          }}
                          disabled={carouselIndex === 0}
                        >
                          <Ionicons name="chevron-back" size={18} color="#FFA500" />
                        </TouchableOpacity>
                        <View style={styles.carouselDots}>
                          {carouselGames.map((_, i) => (
                            <View
                              key={i}
                              style={[
                                styles.carouselDot,
                                i === carouselIndex && styles.carouselDotActive,
                              ]}
                            />
                          ))}
                        </View>
                        <TouchableOpacity
                          style={[styles.carouselArrow, carouselIndex === carouselGames.length - 1 && styles.carouselArrowDisabled]}
                          onPress={() => {
                            const next = Math.min(carouselGames.length - 1, carouselIndex + 1);
                            setCarouselIndex(next);
                            carouselRef.current?.scrollToIndex({ index: next, animated: true });
                          }}
                          disabled={carouselIndex === carouselGames.length - 1}
                        >
                          <Ionicons name="chevron-forward" size={18} color="#FFA500" />
                        </TouchableOpacity>
                      </View>
                    )}
                </View>
            )}

            {/* Team Filter Row */}
            {allTeamsBySport && allTeamsBySport.length > 0 && (() => {
              const sportTeams = selectedSport === "All"
                ? allTeamsBySport
                : allTeamsBySport.filter(s => s.sport === selectedSport);
              const teams = sportTeams.flatMap(s => s.teams);
              if (teams.length === 0) return null;
              return (
                <View style={styles.teamFilterSection}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.teamFilterScroll}>
                    <TouchableOpacity
                      style={[styles.teamPill, !selectedTeam && styles.teamPillActive]}
                      onPress={() => setSelectedTeam(null)}
                    >
                      <Text style={[styles.teamPillText, !selectedTeam && styles.teamPillTextActive]}>ALL</Text>
                    </TouchableOpacity>
                    {teams.map((team, idx) => (
                      <TouchableOpacity
                        key={`${team.sport || 'all'}-${team.abbr}-${idx}`}
                        style={[styles.teamPill, selectedTeam === team.abbr && styles.teamPillActive]}
                        onPress={() => setSelectedTeam(selectedTeam === team.abbr ? null : team.abbr)}
                      >
                        {team.logoUrl ? (
                          <Image source={{ uri: team.logoUrl }} style={styles.teamPillLogo} resizeMode="contain" />
                        ) : null}
                        <Text style={[styles.teamPillText, selectedTeam === team.abbr && styles.teamPillTextActive]}>{team.abbr}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              );
            })()}

            {/* Main Grouped Feed */}
            <View style={styles.listContainer}>
                {Object.keys(groupedGames).map(sport => 
                    renderLeagueSection(sport, groupedGames[sport])
                )}
                
                {allGamesForDate && allGamesForDate.length > listPage * ITEMS_PER_PAGE && (
                    <TouchableOpacity 
                        style={styles.loadMoreBtn}
                        onPress={() => setListPage(prev => prev + 1)}
                    >
                        <Text style={styles.loadMoreText}>LOAD MORE GAMES</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>

        <View style={{height: 120}}/>
      </ScrollView>

      <Modal 
        visible={!!selectedGame} 
        transparent 
        animationType="slide" 
        onRequestClose={() => setSelectedGame(null)}
      >
         <View style={styles.modalOverlay}>
             <View style={styles.smartModalContent}>
                 {selectedGame && (() => {
                     const isLive = selectedGame.status === 'inprogress';
                     const isFinal = selectedGame.status === 'closed';
                     const teamColor = getSportColor(selectedGame.sport);
                     
                     // Power Pairings Logic
                     const getPairings = (sport) => {
                         switch(sport) {
                             case 'NFL': return { food: "BIG GAME WINGS", drink: "ICE COLD DRAFT BUCKET", icon: "flame" };
                             case 'NBA': return { food: "WAGYU SLIDERS", drink: "SIGNATURE OLD FASHIONED", icon: "fast-food" };
                             case 'MLB': return { food: "BALLPARK NACHOS", drink: "COLD DOMESTIC TALLBOY", icon: "beer" };
                             case 'NHL': return { food: "POUTINE FRIES", drink: "MOLSON CANADIAN", icon: "ice-cream" };
                             default: return { food: "LEGENDARY BURGER", drink: "CRAFT IPA", icon: "restaurant" };
                         }
                     };
                     const pairings = getPairings(selectedGame.sport);

                     return (
                         <>
                            {/* Header: League & Close */}
                            <View style={styles.modalHeader}>
                                <View style={[styles.modalSportPill, { backgroundColor: getSportColor(selectedGame.sport) }]}>
                                    <Text style={styles.modalSportText}>{selectedGame.sport}</Text>
                                </View>
                                
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {isLive ? (
                                        <Text style={[styles.modalStatusText, { color: '#FFA500', marginRight: 20 }]}>LIVE NOW</Text>
                                    ) : (
                                        <Text style={[styles.modalStatusText, { marginRight: 20 }]}>
                                            {new Date(selectedGame.startsAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
                                        </Text>
                                    )}
                                    <TouchableOpacity style={{ padding: 5 }} onPress={() => setSelectedGame(null)}>
                                        <Ionicons name="close" size={26} color="#FFA500" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Matchup Team Row */}
                            <View style={styles.modalMatchupBox}>
                                <View style={styles.modalTeamSide}>
                                    <View style={styles.modalLogoCircle}>
                                        {selectedGame.awayTeam?.logoUrl ? (
                                            <Image source={{ uri: selectedGame.awayTeam.logoUrl }} style={styles.modalLogoSmall} resizeMode="contain" />
                                        ) : (
                                            <Text style={styles.modalLogoFallbackText}>{selectedGame.awayTeam?.abbr}</Text>
                                        )}
                                    </View>
                                    <Text style={styles.modalTeamNameText}>{selectedGame.awayTeam?.name?.toUpperCase()}</Text>
                                    {(isLive || isFinal) && (
                                        <Text style={styles.modalScoreText}>{selectedGame.awayTeam?.score ?? selectedGame.awayTeam?.runs ?? 0}</Text>
                                    )}
                                </View>

                                <View style={styles.modalVsCol}>
                                    <Text style={styles.modalVsText}>VS</Text>
                                    {!isLive && !isFinal && (
                                        <Text style={styles.modalTimeText}>
                                            {new Date(selectedGame.startsAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.modalTeamSide}>
                                    <View style={styles.modalLogoCircle}>
                                        {selectedGame.homeTeam?.logoUrl ? (
                                            <Image source={{ uri: selectedGame.homeTeam.logoUrl }} style={styles.modalLogoSmall} resizeMode="contain" />
                                        ) : (
                                            <Text style={styles.modalLogoFallbackText}>{selectedGame.homeTeam?.abbr}</Text>
                                        )}
                                    </View>
                                    <Text style={styles.modalTeamNameText}>{selectedGame.homeTeam?.name?.toUpperCase()}</Text>
                                    {(isLive || isFinal) && (
                                        <Text style={styles.modalScoreText}>{selectedGame.homeTeam?.score ?? selectedGame.homeTeam?.runs ?? 0}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Game Highlights — only for final games with a real highlight URL */}
                            {isFinal && selectedGame.highlightVideoId && (
                                <View style={styles.modalHighlightSection}>
                                    <View style={styles.modalSectionLabel}>
                                        <Ionicons name="play-circle" size={12} color="#E31837" />
                                        <Text style={styles.modalSectionLabelText}>GAME HIGHLIGHTS</Text>
                                    </View>
                                    <View style={styles.modalVideoPlayerContainer}>
                                        <Video
                                            source={{ uri: selectedGame.highlightVideoId }}
                                            style={{ width: "100%", height: RFValue(190) }}
                                            useNativeControls
                                            resizeMode={"cover" as any}
                                            shouldPlay={false}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Bar Map / TV Zone */}
                            {selectedGame.tvZone ? (
                                <View style={styles.modalBarMapSection}>
                                    <View style={styles.modalSectionLabel}>
                                        <Ionicons name="tv" size={12} color="#FFA500" />
                                        <Text style={styles.modalSectionLabelText}>WATCHING AT THE BAR</Text>
                                    </View>
                                    <View style={styles.modalTvZoneHighlight}>
                                        <Text style={styles.modalTvZoneStrong}>{selectedGame.tvZone}</Text>
                                        <Text style={styles.modalTvZoneSmall}>SIT NEAR THE {selectedGame.tvZone} FOR THE BEST VIEW</Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.modalBarMapSection}>
                                    <View style={styles.modalSectionLabel}>
                                        <Ionicons name="location" size={12} color="#FFA500" />
                                        <Text style={styles.modalSectionLabelText}>VENUE LOCATION</Text>
                                    </View>
                                    <Text style={styles.modalVenueText}>{selectedGame.venue?.name || "RESERVE A TABLE TO WATCH"}</Text>
                                </View>
                            )}

                            {/* Power Pairings */}
                            <View style={styles.modalPairingSection}>
                                <View style={styles.modalSectionLabel}>
                                    <Ionicons name={pairings.icon} size={12} color="#FFA500" />
                                    <Text style={styles.modalSectionLabelText}>CHAMPIONSHIP FUEL (PAIRINGS)</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.modalPairingCard}
                                    onPress={() => {
                                        setSelectedGame(null);
                                        navigation.navigate("HomeScreen");
                                    }}
                                >
                                    <Text style={styles.modalPairingTitle}>{pairings.food}</Text>
                                    <Text style={styles.modalPairingPlus}>+</Text>
                                    <Text style={styles.modalPairingDrink}>{pairings.drink}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Reserve Button */}
                            <TouchableOpacity style={styles.modalReserveBtn} onPress={() => setSelectedGame(null)}>
                                <Text style={styles.modalReserveBtnText}>RESERVE YOUR TABLE NOW</Text>
                                <Ionicons name="arrow-forward" size={16} color="#000" />
                            </TouchableOpacity>
                         </>
                     );
                 })()}
             </View>
         </View>
      </Modal>

      <Modal visible={showTVGuide} transparent animationType="fade" onRequestClose={() => setShowTVGuide(false)}>
         <View style={styles.modalOverlay}>
             <View style={styles.modalContent}>
                <TouchableOpacity style={styles.modalCloseIcon} onPress={() => setShowTVGuide(false)}>
                    <Ionicons name="close" size={28} color="#FFA500" />
                </TouchableOpacity>
                <Text style={styles.modalTitleLarge}>BAR TV MAP</Text>
                <View style={styles.tvMapList}>
                    {[
                        { zone: "THE MAIN BAR", chan: "CH 1-10" },
                        { zone: "BACK PROJECTION WALL", chan: "CH 20-25" },
                        { zone: "PATIO FRONT LEFT", chan: "CH 45-50" },
                        { zone: "THE CORNER WALL", chan: "CH 12-18" },
                    ].map((item, idx) => (
                        <View key={idx} style={styles.tvMapRow}>
                            <Text style={styles.tvMapZone}>{item.zone}</Text>
                            <Text style={styles.tvMapChan}>{item.chan}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.tvMapCallout}>ASK YOUR SERVER TO SYNC A TABLE TABLET</Text>
             </View>
         </View>
      </Modal>

      {/* Team Detail Sheet */}
      {selectedTeamDetail && (
        <TeamDetailSheet
          team={selectedTeamDetail.team}
          sport={selectedTeamDetail.sport}
          opponent={selectedTeamDetail.opponent}
          gameStatus={selectedTeamDetail.gameStatus}
          startsAt={selectedTeamDetail.startsAt}
          onClose={() => setSelectedTeamDetail(null)}
        />
      )}

      <BottomNavBar activeTab="GAMES" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  // Score display for closed/live games in list card
  liveScoreBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  liveScoreNum: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  liveScoreDash: {
    color: '#555',
    fontSize: 14,
    fontWeight: '700',
  },
  finalBadgeSmall: {
    backgroundColor: '#222',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#444',
  },
  finalBadgeText: {
    color: '#aaa',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  liveBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(227,24,55,0.15)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  liveDotSmall: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E31837',
  },
  liveBadgeSmallText: {
    color: '#E31837',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  // Date dividers — separate yesterday's finals from today's games
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
    paddingHorizontal: 4,
  },
  dateDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2a2a2a',
  },
  dateDividerLabel: {
    color: '#666',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  topNav: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    zIndex: 200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  navBack: {
    width: 40,
  },
  navLogo: {
    width: 80,
    alignItems: 'flex-end',
  },
  floatingTvBtn: {
    backgroundColor: '#FFA500',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  floatingTvBtnText: {
    color: '#000',
    fontFamily: 'MBold',
    fontSize: 10,
    marginLeft: 8,
    letterSpacing: 2,
  },
  logoText: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: RFValue(12),
    letterSpacing: 2,
  },
  videoHeroContainer: {
    width: width,
    height: 520,
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  titleBlock: {
    alignItems: "center",
    paddingHorizontal: 30,
    zIndex: 10,
  },
  mainTitle: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(38),
    fontStyle: "italic",
    textAlign: "center",
  },
  subTitle: {
    color: "#ccc",
    fontFamily: "MSemiBold",
    fontSize: RFValue(11),
    textAlign: "center",
    marginTop: 12,
    lineHeight: 18,
    opacity: 0.9,
  },
  orangeCallout: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: RFValue(9),
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 25,
    letterSpacing: 3,
  },
  contentWrap: {
    marginTop: -30,
    zIndex: 5,
  },
  primeTimeSection: {
    marginBottom: 40,
  },
  sectionHeaderLineWide: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionHeaderText: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: 10,
    letterSpacing: 2,
    marginLeft: 8,
  },
  carouselContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  heroCard: {
    backgroundColor: "#111",
    width: width * 0.88,
    marginRight: 16,
    borderWidth: 3,
    borderColor: "#FFA500",
    borderRadius: 4,
    overflow: 'hidden',
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  heroHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sportBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  sportBadgeText: {
    color: '#fff',
    fontFamily: 'MBold',
    fontSize: 10,
    letterSpacing: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  liveBadgeText: {
    color: '#22c55e',
    fontFamily: 'MBold',
    fontSize: 9,
    letterSpacing: 2,
  },
  primeTimeLabelText: {
    color: '#FFA500',
    fontFamily: 'MBold',
    fontSize: 9,
    letterSpacing: 3,
  },
  heroTeamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  heroTeamCol: {
    alignItems: 'center',
    flex: 1,
  },
  heroCenterCol: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  tournamentBody: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  tournamentTitle: {
    color: '#fff',
    fontFamily: 'MBold',
    fontSize: RFValue(16),
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  logoCircleLarge: {
      width: 64,
      height: 64,
      backgroundColor: '#fff',
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      borderWidth: 3,
      borderColor: '#e5e5e5',
  },
  heroLogoLarge: {
      width: 40,
      height: 40,
  },
  logoFallbackTextLarge: {
      color: '#000',
      fontFamily: 'MBold',
      fontSize: 18,
  },
  heroTeamNameLarge: {
      color: '#fff',
      fontFamily: 'MBold',
      fontSize: RFValue(9),
      textAlign: 'center',
      letterSpacing: 1,
  },
  heroScoreLarge: {
      color: '#fff',
      fontFamily: 'MBold',
      fontSize: RFValue(28),
  },
  heroScoreDividerLarge: {
      color: '#333',
      fontSize: 22,
      marginVertical: -2,
  },
  heroTimeLarge: {
      color: '#FFA500',
      fontFamily: 'MBold',
      fontSize: RFValue(22),
  },
  heroDateSub: {
      color: '#888',
      fontFamily: 'MBold',
      fontSize: 9,
      letterSpacing: 2,
      marginTop: 4,
  },
  heroDayNight: {
      color: '#666',
      fontSize: 9,
      marginTop: 4,
  },
  heroFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#222',
      paddingHorizontal: 16,
      paddingVertical: 12,
  },
  heroFooterLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flex: 1,
  },
  heroFooterText: {
      color: '#666',
      fontFamily: 'MBold',
      fontSize: 9,
      textTransform: 'uppercase',
      letterSpacing: 1,
  },
  heroFooterTap: {
      color: '#444',
      fontFamily: 'MBold',
      fontSize: 8,
      letterSpacing: 2,
  },
  carouselNav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      marginTop: 14,
      marginBottom: 10,
  },
  carouselArrow: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 2,
      borderColor: 'rgba(255,165,0,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
  },
  carouselArrowDisabled: {
      opacity: 0.2,
  },
  carouselDots: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  carouselDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#333',
  },
  carouselDotActive: {
      backgroundColor: '#FFA500',
      width: 20,
  },

  dateSelectorSection: {
    marginBottom: 20,
    zIndex: 10,
  },
  dateScroll: {
    paddingHorizontal: 10,
  },
  dateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#111',
  },
  dateBoxActive: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  dateLabel: {
    color: '#999',
    fontFamily: 'MBold',
    fontSize: 12,
    letterSpacing: 1,
  },
  dateLabelActive: {
    color: '#000',
  },
  dateSub: {
    color: '#555',
    fontFamily: 'MSemiBold',
    fontSize: 9,
    marginTop: 2,
  },
  dateSubActive: {
    color: 'rgba(0,0,0,0.7)',
  },
  filterSection: {
    marginBottom: 30,
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 15,
  },
  filterPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#111',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#222',
  },
  filterPillActive: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  filterText: {
    color: '#666',
    fontFamily: 'MBold',
    fontSize: 10,
    letterSpacing: 1,
  },
  filterTextActive: {
    color: '#000',
  },
  // Team Filter Row
  teamFilterSection: {
    marginBottom: 4,
  },
  teamFilterScroll: {
    paddingHorizontal: 16,
    gap: 6,
    paddingVertical: 6,
  },
  teamPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
    gap: 4,
  },
  teamPillActive: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  teamPillLogo: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  teamPillText: {
    color: '#666',
    fontFamily: 'MBold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  teamPillTextActive: {
    color: '#000',
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  cardContainer: {
    backgroundColor: '#0F0F0F',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  listCard: {
    marginBottom: 12,
  },
  loadMoreBtn: {
      backgroundColor: '#111',
      paddingVertical: 18,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
      borderWidth: 1,
      borderColor: '#222',
      marginBottom: 30,
  },
  loadMoreText: {
      color: '#FFA500',
      fontFamily: 'MBold',
      fontSize: 11,
      letterSpacing: 2,
  },
  leagueSection: {
      marginTop: 35,
  },
  leagueHeaderLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      marginBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#1a1a1a',
      paddingBottom: 10,
  },
  leagueHeaderLabelSide: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  leagueAccentPill: {
      width: 4,
      height: 14,
      borderRadius: 2,
  },
  leagueHeaderTitle: {
      color: '#fff',
      fontFamily: 'MBold',
      fontSize: 11,
      letterSpacing: 2,
  },
  leagueRightSide: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  leagueGameCount: {
      color: '#444',
      fontFamily: 'MBold',
      fontSize: 10,
      letterSpacing: 1,
  },
  listLeftCol: {
      flex: 3,
      gap: 6,
  },
  listTimeMain: {
      color: '#FFA500',
      fontFamily: 'MBold',
      fontSize: 14,
  },
  listSubInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  listSubInfoText: {
      color: '#888',
      fontFamily: 'MSemiBold',
      fontSize: 9,
      textTransform: 'uppercase',
  },
  listCenterCol: {
      flex: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 15,
  },
  listTeamUnit: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
  },
  listTeamAbbrMain: {
      color: '#fff',
      fontFamily: 'MBold',
      fontSize: 16,
  },
  listLogoMain: {
      width: 26,
      height: 26,
  },
  listVersusText: {
      color: '#222',
      fontFamily: 'MRegular',
      fontSize: 12,
  },
  listRightCol: {
      flex: 2,
      alignItems: 'flex-end',
  },
  winProbContainer: {
      alignItems: 'flex-end',
      gap: 4,
  },
  winProbBar: {
      height: 4,
      borderRadius: 2,
  },
  winProbText: {
      color: '#444',
      fontFamily: 'MBold',
      fontSize: 9,
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  modalContent: {
      width: '90%',
      backgroundColor: '#111',
      borderRadius: 24,
      padding: 35,
      borderWidth: 1,
      borderColor: '#222',
  },
  modalCloseIcon: {
      position: 'absolute',
      top: 25,
      right: 25,
      zIndex: 10,
  },
  modalSportTitle: {
      color: '#FFA500',
      fontFamily: 'MBold',
      fontSize: 11,
      letterSpacing: 3,
      marginBottom: 8,
  },
  modalTeamName: {
      color: '#fff',
      fontFamily: 'MBold',
      fontSize: RFValue(20),
      marginBottom: 20,
      paddingRight: 30,
  },
  modalInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 25,
  },
  modalInfoText: {
      color: '#888',
      fontFamily: 'MRegular',
      fontSize: 14,
  },
  modalTvZoneContainer: {
      backgroundColor: '#FFA500',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 8,
      alignSelf: 'flex-start',
  },
  modalTvZoneText: {
      color: '#000',
      fontFamily: 'MBold',
      fontSize: 11,
      marginLeft: 10,
  },
  modalTitleLarge: {
      color: '#FFA500',
      fontFamily: 'MBold',
      fontSize: RFValue(22),
      letterSpacing: 4,
      marginBottom: 30,
      textAlign: 'center',
  },
  tvMapList: {
      gap: 20,
  },
  tvMapRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#1a1a1a',
  },
  tvMapZone: {
      color: '#fff',
      fontFamily: 'MBold',
      fontSize: 15,
  },
  tvMapChan: {
      color: '#FFA500',
      fontFamily: 'MBold',
      fontSize: 14,
  },
  tvMapCallout: {
      color: '#444',
      fontFamily: 'MBold',
      fontSize: 10,
      textAlign: 'center',
      marginTop: 40,
      letterSpacing: 2,
  },
  offSeasonCard: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  offSeasonTitle: {
    color: '#666',
    fontFamily: 'MBold',
    fontSize: 10,
    letterSpacing: 2,
    textAlign: 'center',
  },
  offSeasonSub: {
    color: '#444',
    fontFamily: 'MSemiBold',
    fontSize: 8,
    marginTop: 8,
    textAlign: 'center',
  },
  smartModalContent: {
    backgroundColor: "#0F0F0F",
    width: width,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingTop: 40,
    borderWidth: 1,
    borderColor: '#222',
    marginTop: 'auto',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  modalSportPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
  },
  modalSportText: {
    color: '#fff',
    fontFamily: 'MBold',
    fontSize: 10,
    letterSpacing: 2,
  },
  modalStatusText: {
    color: '#666',
    fontFamily: 'MBold',
    fontSize: 10,
    letterSpacing: 1,
  },
  modalMatchupBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  modalTeamSide: {
    alignItems: 'center',
    flex: 1,
  },
  modalVsCol: {
    alignItems: 'center',
    width: 60,
  },
  modalVsText: {
    color: '#222',
    fontFamily: 'MBold',
    fontSize: 24,
    fontStyle: 'italic',
  },
  modalTimeText: {
    color: '#FFA500',
    fontFamily: 'MBold',
    fontSize: 12,
    marginTop: 5,
  },
  modalLogoCircle: {
      width: 70,
      height: 70,
      backgroundColor: '#fff',
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      borderWidth: 2,
      borderColor: '#e5e5e5',
  },
  modalLogoSmall: {
    width: 45,
    height: 45,
  },
  modalTeamNameText: {
    color: '#fff',
    fontFamily: 'MBold',
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  modalScoreText: {
    color: '#FFA500',
    fontFamily: 'MBold',
    fontSize: 32,
    marginTop: 8,
  },
  modalSectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  modalSectionLabelText: {
    color: '#444',
    fontFamily: 'MBold',
    fontSize: 9,
    letterSpacing: 2,
  },
  modalHighlightSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalVideoPlayerContainer: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 10,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  modalBarMapSection: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#151515',
    borderRadius: 12,
  },
  modalTvZoneHighlight: {
    alignItems: 'center',
  },
  modalTvZoneStrong: {
    color: '#fff',
    fontFamily: 'MBold',
    fontSize: 18,
    letterSpacing: 1,
  },
  modalTvZoneSmall: {
    color: '#666',
    fontFamily: 'MSemiBold',
    fontSize: 8,
    marginTop: 6,
    letterSpacing: 1,
  },
  modalVenueText: {
    color: '#fff',
    fontFamily: 'MSemiBold',
    fontSize: 12,
  },
  modalPairingSection: {
    marginBottom: 40,
  },
  modalPairingCard: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalPairingTitle: {
    color: '#fff',
    fontFamily: 'MBold',
    fontSize: 14,
    letterSpacing: 1,
  },
  modalPairingPlus: {
    color: '#FFA500',
    fontSize: 18,
    marginVertical: 4,
  },
  modalPairingDrink: {
    color: '#FFA500',
    fontFamily: 'MBold',
    fontSize: 12,
    letterSpacing: 1,
  },
  modalReserveBtn: {
    backgroundColor: '#FFA500',
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  modalReserveBtnText: {
    color: '#000',
    fontFamily: 'MBold',
    fontSize: 12,
    letterSpacing: 1,
  },
  // --- Favorite Team Styles ---
  favBadge: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "center",
  },
  favBadgeText: {
    color: "#000",
    fontFamily: "MBold",
    fontSize: 7,
    letterSpacing: 0.5,
  },
});

export default LiveGamesScreen;
