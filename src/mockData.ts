export interface OddOption {
    id: string;
    label: string;
    subLabel?: string;
    marketName: string;
    matchId: string;
    matchTitle: string;
    league: string;
    odds: number;
    prevOdds?: number;
    direction?: 'up' | 'down' | null;
    suspended?: boolean;
  }
  
  export interface MatchFixture {
    id: string;
    sport: 'football' | 'basketball' | 'tennis' | 'esports' | 'mma';
    competitionId: string;
    competitionName: string;
    country: string;
    homeTeam: string;
    awayTeam: string;
    homeColors: [string, string];
    awayColors: [string, string];
    isLive: boolean;
    minute?: number;
    period?: string;
    kickoff?: string;
    homeScore?: number;
    awayScore?: number;
    goalSummary?: string;
    suspended?: boolean;
    markets1X2: {
      home: OddOption;
      draw?: OddOption;
      away: OddOption;
    };
  }
  
  export interface MarketGroupItem {
    id: string;
    title: string;
    category: 'Popular' | 'Goals' | 'Halves' | 'Handicaps' | 'Goalscorers' | 'Corners & cards';
    suspended?: boolean;
    columns: 2 | 3;
    options: OddOption[];
  }
  
  export interface PlacedBet {
    id: string;
    selectionId: string;
    selectionLabel: string;
    marketName: string;
    matchTitle: string;
    league: string;
    isLive: boolean;
    matchScore?: string;
    odds: number;
    stake: number;
    potentialReturn: number;
    status: 'open' | 'won' | 'lost' | 'cashed_out';
    cashOutValue?: number;
    placedAt: string;
  }
  
  export const TOP_COMPETITIONS = [
    { id: 'epl', name: 'Premier League', country: 'England', sport: 'football', count: 10, badge: 'EPL' },
    { id: 'ucl', name: 'Champions League', country: 'Europe', sport: 'football', count: 8, badge: 'UCL' },
    { id: 'laliga', name: 'LaLiga', country: 'Spain', sport: 'football', count: 10, badge: 'LAL' },
    { id: 'seriea', name: 'Serie A', country: 'Italy', sport: 'football', count: 9, badge: 'SER' },
    { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', sport: 'football', count: 9, badge: 'BUN' },
  ];
  
  export const SPORTS_LIST = [
    { id: 'all', name: 'All Sports', count: 28 },
    { id: 'football', name: 'Football', count: 16 },
    { id: 'tennis', name: 'Tennis', count: 5 },
    { id: 'basketball', name: 'Basketball', count: 4 },
    { id: 'esports', name: 'Esports', count: 3 },
  ];
  
  export const INITIAL_MATCHES: MatchFixture[] = [
    {
      id: 'm-ars-bha',
      sport: 'football',
      competitionId: 'epl',
      competitionName: 'Premier League',
      country: 'England',
      homeTeam: 'Arsenal',
      awayTeam: 'Brighton',
      homeColors: ['#EF0107', '#FFFFFF'],
      awayColors: ['#0057B8', '#FFCD00'],
      isLive: true,
      minute: 64,
      period: '2nd Half',
      homeScore: 2,
      awayScore: 1,
      goalSummary: "Saka 14', Havertz 52' • Joao Pedro 39'",
      markets1X2: {
        home: {
          id: 'ars-bha-1',
          label: 'Arsenal',
          subLabel: '1',
          marketName: 'Match Result',
          matchId: 'm-ars-bha',
          matchTitle: 'Arsenal v Brighton',
          league: 'Premier League',
          odds: 1.42,
        },
        draw: {
          id: 'ars-bha-x',
          label: 'Draw',
          subLabel: 'X',
          marketName: 'Match Result',
          matchId: 'm-ars-bha',
          matchTitle: 'Arsenal v Brighton',
          league: 'Premier League',
          odds: 4.60,
        },
        away: {
          id: 'ars-bha-2',
          label: 'Brighton',
          subLabel: '2',
          marketName: 'Match Result',
          matchId: 'm-ars-bha',
          matchTitle: 'Arsenal v Brighton',
          league: 'Premier League',
          odds: 7.50,
        },
      },
    },
    {
      id: 'm-rma-bar',
      sport: 'football',
      competitionId: 'laliga',
      competitionName: 'LaLiga',
      country: 'Spain',
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      homeColors: ['#FEBE10', '#FFFFFF'],
      awayColors: ['#A50044', '#004D98'],
      isLive: true,
      minute: 38,
      period: '1st Half',
      homeScore: 1,
      awayScore: 1,
      markets1X2: {
        home: {
          id: 'rma-bar-1',
          label: 'Real Madrid',
          subLabel: '1',
          marketName: 'Match Result',
          matchId: 'm-rma-bar',
          matchTitle: 'Real Madrid v Barcelona',
          league: 'LaLiga',
          odds: 2.15,
        },
        draw: {
          id: 'rma-bar-x',
          label: 'Draw',
          subLabel: 'X',
          marketName: 'Match Result',
          matchId: 'm-rma-bar',
          matchTitle: 'Real Madrid v Barcelona',
          league: 'LaLiga',
          odds: 3.40,
        },
        away: {
          id: 'rma-bar-2',
          label: 'Barcelona',
          subLabel: '2',
          marketName: 'Match Result',
          matchId: 'm-rma-bar',
          matchTitle: 'Real Madrid v Barcelona',
          league: 'LaLiga',
          odds: 3.25,
        },
      },
    },
    {
      id: 'm-int-juv',
      sport: 'football',
      competitionId: 'seriea',
      competitionName: 'Serie A',
      country: 'Italy',
      homeTeam: 'Inter Milan',
      awayTeam: 'Juventus',
      homeColors: ['#010E80', '#000000'],
      awayColors: ['#FFFFFF', '#000000'],
      isLive: true,
      minute: 79,
      period: '2nd Half',
      homeScore: 0,
      awayScore: 0,
      markets1X2: {
        home: {
          id: 'int-juv-1',
          label: 'Inter Milan',
          subLabel: '1',
          marketName: 'Match Result',
          matchId: 'm-int-juv',
          matchTitle: 'Inter Milan v Juventus',
          league: 'Serie A',
          odds: 2.65,
        },
        draw: {
          id: 'int-juv-x',
          label: 'Draw',
          subLabel: 'X',
          marketName: 'Match Result',
          matchId: 'm-int-juv',
          matchTitle: 'Inter Milan v Juventus',
          league: 'Serie A',
          odds: 2.05,
        },
        away: {
          id: 'int-juv-2',
          label: 'Juventus',
          subLabel: '2',
          marketName: 'Match Result',
          matchId: 'm-int-juv',
          matchTitle: 'Inter Milan v Juventus',
          league: 'Serie A',
          odds: 4.30,
        },
      },
    },
    {
      id: 'm-bay-bvb',
      sport: 'football',
      competitionId: 'bundesliga',
      competitionName: 'Bundesliga',
      country: 'Germany',
      homeTeam: 'Bayern Munich',
      awayTeam: 'Borussia Dortmund',
      homeColors: ['#DC052D', '#FFFFFF'],
      awayColors: ['#FDE100', '#000000'],
      isLive: true,
      minute: 51,
      period: '2nd Half',
      homeScore: 2,
      awayScore: 2,
      markets1X2: {
        home: {
          id: 'bay-bvb-1',
          label: 'Bayern Munich',
          subLabel: '1',
          marketName: 'Match Result',
          matchId: 'm-bay-bvb',
          matchTitle: 'Bayern Munich v Borussia Dortmund',
          league: 'Bundesliga',
          odds: 1.78,
        },
        draw: {
          id: 'bay-bvb-x',
          label: 'Draw',
          subLabel: 'X',
          marketName: 'Match Result',
          matchId: 'm-bay-bvb',
          matchTitle: 'Bayern Munich v Borussia Dortmund',
          league: 'Bundesliga',
          odds: 3.95,
        },
        away: {
          id: 'bay-bvb-2',
          label: 'Borussia Dortmund',
          subLabel: '2',
          marketName: 'Match Result',
          matchId: 'm-bay-bvb',
          matchTitle: 'Bayern Munich v Borussia Dortmund',
          league: 'Bundesliga',
          odds: 4.10,
        },
      },
    },
    {
      id: 'm-alc-sin',
      sport: 'tennis',
      competitionId: 'atp',
      competitionName: 'ATP Finals',
      country: 'World',
      homeTeam: 'Carlos Alcaraz',
      awayTeam: 'Jannik Sinner',
      homeColors: ['#F59E0B', '#EF4444'],
      awayColors: ['#10B981', '#3B82F6'],
      isLive: true,
      minute: 2,
      period: 'Set 2',
      homeScore: 1,
      awayScore: 0,
      markets1X2: {
        home: {
          id: 'alc-sin-1',
          label: 'Carlos Alcaraz',
          subLabel: '1',
          marketName: 'Match Winner',
          matchId: 'm-alc-sin',
          matchTitle: 'Carlos Alcaraz v Jannik Sinner',
          league: 'ATP Finals',
          odds: 1.62,
        },
        away: {
          id: 'alc-sin-2',
          label: 'Jannik Sinner',
          subLabel: '2',
          marketName: 'Match Winner',
          matchId: 'm-alc-sin',
          matchTitle: 'Carlos Alcaraz v Jannik Sinner',
          league: 'ATP Finals',
          odds: 2.30,
        },
      },
    },
    {
      id: 'm-lak-cel',
      sport: 'basketball',
      competitionId: 'nba',
      competitionName: 'NBA',
      country: 'USA',
      homeTeam: 'LA Lakers',
      awayTeam: 'Boston Celtics',
      homeColors: ['#FDB927', '#552583'],
      awayColors: ['#007A33', '#FFFFFF'],
      isLive: true,
      minute: 8,
      period: 'Q3',
      homeScore: 78,
      awayScore: 82,
      markets1X2: {
        home: {
          id: 'lak-cel-1',
          label: 'LA Lakers',
          subLabel: '1',
          marketName: 'Moneyline',
          matchId: 'm-lak-cel',
          matchTitle: 'LA Lakers v Boston Celtics',
          league: 'NBA',
          odds: 2.40,
        },
        away: {
          id: 'lak-cel-2',
          label: 'Boston Celtics',
          subLabel: '2',
          marketName: 'Moneyline',
          matchId: 'm-lak-cel',
          matchTitle: 'LA Lakers v Boston Celtics',
          league: 'NBA',
          odds: 1.58,
        },
      },
    },
    // STARTING SOON MATCHES
    {
      id: 'm-mci-liv',
      sport: 'football',
      competitionId: 'epl',
      competitionName: 'Premier League',
      country: 'England',
      homeTeam: 'Manchester City',
      awayTeam: 'Liverpool',
      homeColors: ['#6CABDD', '#FFFFFF'],
      awayColors: ['#C8102E', '#F6EB61'],
      isLive: false,
      kickoff: 'Today • 20:00',
      markets1X2: {
        home: {
          id: 'mci-liv-1',
          label: 'Manchester City',
          subLabel: '1',
          marketName: 'Match Result',
          matchId: 'm-mci-liv',
          matchTitle: 'Manchester City v Liverpool',
          league: 'Premier League',
          odds: 1.95,
        },
        draw: {
          id: 'mci-liv-x',
          label: 'Draw',
          subLabel: 'X',
          marketName: 'Match Result',
          matchId: 'm-mci-liv',
          matchTitle: 'Manchester City v Liverpool',
          league: 'Premier League',
          odds: 3.75,
        },
        away: {
          id: 'mci-liv-2',
          label: 'Liverpool',
          subLabel: '2',
          marketName: 'Match Result',
          matchId: 'm-mci-liv',
          matchTitle: 'Manchester City v Liverpool',
          league: 'Premier League',
          odds: 3.60,
        },
      },
    },
    {
      id: 'm-psg-atm',
      sport: 'football',
      competitionId: 'ucl',
      competitionName: 'Champions League',
      country: 'Europe',
      homeTeam: 'Paris SG',
      awayTeam: 'Atletico Madrid',
      homeColors: ['#004170', '#DA291C'],
      awayColors: ['#CB3524', '#FFFFFF'],
      isLive: false,
      kickoff: 'Today • 21:00',
      markets1X2: {
        home: {
          id: 'psg-atm-1',
          label: 'Paris SG',
          subLabel: '1',
          marketName: 'Match Result',
          matchId: 'm-psg-atm',
          matchTitle: 'Paris SG v Atletico Madrid',
          league: 'Champions League',
          odds: 1.75,
        },
        draw: {
          id: 'psg-atm-x',
          label: 'Draw',
          subLabel: 'X',
          marketName: 'Match Result',
          matchId: 'm-psg-atm',
          matchTitle: 'Paris SG v Atletico Madrid',
          league: 'Champions League',
          odds: 3.65,
        },
        away: {
          id: 'psg-atm-2',
          label: 'Atletico Madrid',
          subLabel: '2',
          marketName: 'Match Result',
          matchId: 'm-psg-atm',
          matchTitle: 'Paris SG v Atletico Madrid',
          league: 'Champions League',
          odds: 4.80,
        },
      },
    },
    {
      id: 'm-che-new',
      sport: 'football',
      competitionId: 'epl',
      competitionName: 'Premier League',
      country: 'England',
      homeTeam: 'Chelsea',
      awayTeam: 'Newcastle',
      homeColors: ['#034694', '#FFFFFF'],
      awayColors: ['#241F20', '#FFFFFF'],
      isLive: false,
      kickoff: 'Tomorrow • 16:30',
      markets1X2: {
        home: {
          id: 'che-new-1',
          label: 'Chelsea',
          subLabel: '1',
          marketName: 'Match Result',
          matchId: 'm-che-new',
          matchTitle: 'Chelsea v Newcastle',
          league: 'Premier League',
          odds: 1.88,
        },
        draw: {
          id: 'che-new-x',
          label: 'Draw',
          subLabel: 'X',
          marketName: 'Match Result',
          matchId: 'm-che-new',
          matchTitle: 'Chelsea v Newcastle',
          league: 'Premier League',
          odds: 3.80,
        },
        away: {
          id: 'che-new-2',
          label: 'Newcastle',
          subLabel: '2',
          marketName: 'Match Result',
          matchId: 'm-che-new',
          matchTitle: 'Chelsea v Newcastle',
          league: 'Premier League',
          odds: 3.90,
        },
      },
    },
    {
      id: 'm-mil-nap',
      sport: 'football',
      competitionId: 'seriea',
      competitionName: 'Serie A',
      country: 'Italy',
      homeTeam: 'AC Milan',
      awayTeam: 'Napoli',
      homeColors: ['#FB090B', '#000000'],
      awayColors: ['#12A0D7', '#FFFFFF'],
      isLive: false,
      kickoff: 'Tomorrow • 19:45',
      markets1X2: {
        home: {
          id: 'mil-nap-1',
          label: 'AC Milan',
          subLabel: '1',
          marketName: 'Match Result',
          matchId: 'm-mil-nap',
          matchTitle: 'AC Milan v Napoli',
          league: 'Serie A',
          odds: 2.35,
        },
        draw: {
          id: 'mil-nap-x',
          label: 'Draw',
          subLabel: 'X',
          marketName: 'Match Result',
          matchId: 'm-mil-nap',
          matchTitle: 'AC Milan v Napoli',
          league: 'Serie A',
          odds: 3.30,
        },
        away: {
          id: 'mil-nap-2',
          label: 'Napoli',
          subLabel: '2',
          marketName: 'Match Result',
          matchId: 'm-mil-nap',
          matchTitle: 'AC Milan v Napoli',
          league: 'Serie A',
          odds: 3.05,
        },
      },
    },
    {
      id: 'm-lev-rbl',
      sport: 'football',
      competitionId: 'bundesliga',
      competitionName: 'Bundesliga',
      country: 'Germany',
      homeTeam: 'Bayer Leverkusen',
      awayTeam: 'RB Leipzig',
      homeColors: ['#E32221', '#000000'],
      awayColors: ['#DD0741', '#FFFFFF'],
      isLive: false,
      kickoff: 'Tomorrow • 20:30',
      markets1X2: {
        home: {
          id: 'lev-rbl-1',
          label: 'Bayer Leverkusen',
          subLabel: '1',
          marketName: 'Match Result',
          matchId: 'm-lev-rbl',
          matchTitle: 'Bayer Leverkusen v RB Leipzig',
          league: 'Bundesliga',
          odds: 1.82,
        },
        draw: {
          id: 'lev-rbl-x',
          label: 'Draw',
          subLabel: 'X',
          marketName: 'Match Result',
          matchId: 'm-lev-rbl',
          matchTitle: 'Bayer Leverkusen v RB Leipzig',
          league: 'Bundesliga',
          odds: 3.85,
        },
        away: {
          id: 'lev-rbl-2',
          label: 'RB Leipzig',
          subLabel: '2',
          marketName: 'Match Result',
          matchId: 'm-lev-rbl',
          matchTitle: 'Bayer Leverkusen v RB Leipzig',
          league: 'Bundesliga',
          odds: 4.15,
        },
      },
    },
  ];
  
  // ARSENAL v BRIGHTON COMPLETE MARKET GROUPS (20 PT TIEBREAKER)
  export const ARSENAL_BRIGHTON_MARKETS: MarketGroupItem[] = [
    // 1. POPULAR
    {
      id: 'mkt-1x2',
      title: 'Match Result (1X2)',
      category: 'Popular',
      columns: 3,
      options: [
        { id: 'ars-bha-1', label: 'Arsenal', subLabel: '1', marketName: 'Match Result', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.42 },
        { id: 'ars-bha-x', label: 'Draw', subLabel: 'X', marketName: 'Match Result', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 4.60 },
        { id: 'ars-bha-2', label: 'Brighton', subLabel: '2', marketName: 'Match Result', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 7.50 },
      ],
    },
    {
      id: 'mkt-next-goal',
      title: 'Next Goal (4th Goal)',
      category: 'Popular',
      columns: 3,
      options: [
        { id: 'ng-ars', label: 'Arsenal', marketName: 'Next Goal (4th Goal)', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.90 },
        { id: 'ng-none', label: 'No Goal', marketName: 'Next Goal (4th Goal)', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 2.85 },
        { id: 'ng-bha', label: 'Brighton', marketName: 'Next Goal (4th Goal)', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 3.60 },
      ],
    },
    {
      id: 'mkt-dc',
      title: 'Double Chance',
      category: 'Popular',
      columns: 3,
      options: [
        { id: 'dc-1x', label: 'Arsenal or Draw', marketName: 'Double Chance', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.08 },
        { id: 'dc-12', label: 'Arsenal or Brighton', marketName: 'Double Chance', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.18 },
        { id: 'dc-x2', label: 'Draw or Brighton', marketName: 'Double Chance', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 2.75 },
      ],
    },
    // 2. GOALS
    {
      id: 'mkt-ou-goals',
      title: 'Total Goals (Over / Under)',
      category: 'Goals',
      columns: 2,
      options: [
        { id: 'ou-o35', label: 'Over 3.5 Goals', marketName: 'Total Goals', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.55 },
        { id: 'ou-u35', label: 'Under 3.5 Goals', marketName: 'Total Goals', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 2.40 },
        { id: 'ou-o45', label: 'Over 4.5 Goals', marketName: 'Total Goals', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 3.10 },
        { id: 'ou-u45', label: 'Under 4.5 Goals', marketName: 'Total Goals', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.35 },
      ],
    },
    {
      id: 'mkt-team-goals',
      title: 'Arsenal Total Goals',
      category: 'Goals',
      columns: 2,
      options: [
        { id: 'ars-o25', label: 'Arsenal Over 2.5', marketName: 'Arsenal Total Goals', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.72 },
        { id: 'ars-u25', label: 'Arsenal Under 2.5', marketName: 'Arsenal Total Goals', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 2.05 },
      ],
    },
    // 3. HALVES
    {
      id: 'mkt-2h-result',
      title: '2nd Half Result',
      category: 'Halves',
      columns: 3,
      options: [
        { id: '2h-1', label: 'Arsenal', marketName: '2nd Half Result', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.48 },
        { id: '2h-x', label: 'Draw', marketName: '2nd Half Result', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 3.20 },
        { id: '2h-2', label: 'Brighton', marketName: '2nd Half Result', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 9.50 },
      ],
    },
    {
      id: 'mkt-2h-btts',
      title: 'Both Teams to Score in 2nd Half',
      category: 'Halves',
      columns: 2,
      options: [
        { id: '2h-btts-y', label: 'Yes', marketName: 'BTTS in 2nd Half', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 2.65 },
        { id: '2h-btts-n', label: 'No', marketName: 'BTTS in 2nd Half', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.44 },
      ],
    },
    // 4. HANDICAPS
    {
      id: 'mkt-ah',
      title: 'Asian Handicap (In-Play)',
      category: 'Handicaps',
      columns: 2,
      options: [
        { id: 'ah-ars-15', label: 'Arsenal -1.5', marketName: 'Asian Handicap', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 2.18 },
        { id: 'ah-bha-15', label: 'Brighton +1.5', marketName: 'Asian Handicap', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.68 },
        { id: 'ah-ars-05', label: 'Arsenal -0.5', marketName: 'Asian Handicap', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.42 },
        { id: 'ah-bha-05', label: 'Brighton +0.5', marketName: 'Asian Handicap', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 2.80 },
      ],
    },
    // 5. GOALSCORERS
    {
      id: 'mkt-scorers',
      title: 'Anytime Goalscorer (Remaining Time)',
      category: 'Goalscorers',
      columns: 2,
      options: [
        { id: 'gs-saka', label: 'Bukayo Saka (2nd+)', subLabel: 'ARS', marketName: 'Next/Anytime Scorer', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 3.40 },
        { id: 'gs-odegaard', label: 'Martin Odegaard', subLabel: 'ARS', marketName: 'Anytime Goalscorer', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 4.20 },
        { id: 'gs-martinelli', label: 'Gabriel Martinelli', subLabel: 'ARS', marketName: 'Anytime Goalscorer', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 3.75 },
        { id: 'gs-mitoma', label: 'Kaoru Mitoma', subLabel: 'BHA', marketName: 'Anytime Goalscorer', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 5.50 },
        { id: 'gs-welbeck', label: 'Danny Welbeck', subLabel: 'BHA', marketName: 'Anytime Goalscorer', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 5.80 },
        { id: 'gs-trossard', label: 'Leandro Trossard', subLabel: 'ARS', marketName: 'Anytime Goalscorer', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 3.90 },
      ],
    },
    // 6. CORNERS & CARDS
    {
      id: 'mkt-corners',
      title: 'Total Corners (Current: 7)',
      category: 'Corners & cards',
      columns: 2,
      options: [
        { id: 'cor-o95', label: 'Over 9.5 Corners', marketName: 'Total Corners', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.65 },
        { id: 'cor-u95', label: 'Under 9.5 Corners', marketName: 'Total Corners', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 2.15 },
        { id: 'cor-o105', label: 'Over 10.5 Corners', marketName: 'Total Corners', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 2.45 },
        { id: 'cor-u105', label: 'Under 10.5 Corners', marketName: 'Total Corners', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.52 },
      ],
    },
    {
      id: 'mkt-cards',
      title: 'Total Bookings / Cards (Current: 3)',
      category: 'Corners & cards',
      suspended: true, // Default inline suspended market to showcase on Match Page immediately!
      columns: 2,
      options: [
        { id: 'crd-o45', label: 'Over 4.5 Cards', marketName: 'Total Cards', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.80, suspended: true },
        { id: 'crd-u45', label: 'Under 4.5 Cards', marketName: 'Total Cards', matchId: 'm-ars-bha', matchTitle: 'Arsenal v Brighton', league: 'Premier League', odds: 1.95, suspended: true },
      ],
    },
  ];
  
  export const INITIAL_MY_BETS: PlacedBet[] = [
    {
      id: 'hb-99412',
      selectionId: 'ars-bha-1',
      selectionLabel: 'Arsenal',
      marketName: 'Match Result',
      matchTitle: 'Arsenal v Brighton',
      league: 'Premier League',
      isLive: true,
      matchScore: '2 - 1 (64\')',
      odds: 1.85,
      stake: 50,
      potentialReturn: 92.50,
      status: 'open',
      cashOutValue: 74.20,
      placedAt: 'Today, 18:32',
    },
    {
      id: 'hb-99388',
      selectionId: 'rma-bar-x',
      selectionLabel: 'Draw',
      marketName: 'Match Result',
      matchTitle: 'Real Madrid v Barcelona',
      league: 'LaLiga',
      isLive: true,
      matchScore: '1 - 1 (38\')',
      odds: 3.40,
      stake: 25,
      potentialReturn: 85.00,
      status: 'open',
      cashOutValue: 26.80,
      placedAt: 'Today, 19:05',
    },
    {
      id: 'hb-98104',
      selectionId: 'tot-avl-1',
      selectionLabel: 'Over 2.5 Goals',
      marketName: 'Total Goals',
      matchTitle: 'Tottenham v Aston Villa',
      league: 'Premier League',
      isLive: false,
      matchScore: 'FT 4 - 1',
      odds: 1.65,
      stake: 100,
      potentialReturn: 165.00,
      status: 'won',
      placedAt: 'Yesterday, 16:45',
    },
    {
      id: 'hb-97820',
      selectionId: 'utd-che-1',
      selectionLabel: 'Manchester United',
      marketName: 'Match Result',
      matchTitle: 'Man United v Chelsea',
      league: 'Premier League',
      isLive: false,
      matchScore: 'FT 1 - 1',
      odds: 2.50,
      stake: 40,
      potentialReturn: 100.00,
      status: 'lost',
      placedAt: 'Yesterday, 14:10',
    },
  ];
  
  export const SEARCHABLE_PLAYERS_AND_MARKETS = [
    { type: 'Player', name: 'Bukayo Saka', detail: 'Arsenal • Anytime Goalscorer (3.40)', targetPage: 'match' },
    { type: 'Player', name: 'Kai Havertz', detail: 'Arsenal • Scored 52\'', targetPage: 'match' },
    { type: 'Player', name: 'Martin Odegaard', detail: 'Arsenal • Anytime Goalscorer (4.20)', targetPage: 'match' },
    { type: 'Player', name: 'Joao Pedro', detail: 'Brighton • Scored 39\'', targetPage: 'match' },
    { type: 'Player', name: 'Kaoru Mitoma', detail: 'Brighton • Anytime Goalscorer (5.50)', targetPage: 'match' },
    { type: 'Market', name: 'Asian Handicap (-1.5 / +1.5)', detail: 'Arsenal v Brighton • Live Market', targetPage: 'match' },
    { type: 'Market', name: 'Total Goals Over/Under 3.5', detail: 'Arsenal v Brighton • Live Market', targetPage: 'match' },
    { type: 'Market', name: 'Total Corners Over/Under 9.5', detail: 'Arsenal v Brighton • Live Market', targetPage: 'match' },
  ];
