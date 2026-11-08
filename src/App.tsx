import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Flame,
  Trophy,
  Star,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronDown,
  Clock,
  Wallet,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  X,
  Receipt,
  Sparkles,
  Shield,
  Activity,
  RotateCcw,
} from 'lucide-react';
import {
  INITIAL_MATCHES,
  ARSENAL_BRIGHTON_MARKETS,
  INITIAL_MY_BETS,
  TOP_COMPETITIONS,
  SPORTS_LIST,
  SEARCHABLE_PLAYERS_AND_MARKETS,
  MatchFixture,
  OddOption,
  MarketGroupItem,
  PlacedBet,
} from './mockData';

type ActivePage = 'home' | 'live' | 'football' | 'match' | 'betslip-mobile';
type SlipTab = 'slip' | 'mybets';
type MyBetsFilter = 'open' | 'settled' | 'cashout';

const TeamCrest: React.FC<{ name: string; colors: [string, string]; size?: 'sm' | 'md' | 'lg' }> = ({
  name,
  colors,
  size = 'sm',
}) => {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
  const dimensions =
    size === 'lg' ? 'w-11 h-11 text-xs' : size === 'md' ? 'w-7 h-7 text-[10px]' : 'w-5 h-5 text-[8px]';

  return (
    <div
      className={`${dimensions} rounded-full flex items-center justify-center font-extrabold tracking-tighter shrink-0 shadow-inner border border-white/15 relative overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${colors[0]} 55%, ${colors[1]} 45%)`,
      }}
      title={name}
    >
      <span className="bg-black/65 text-white px-1 rounded-sm leading-none py-0.5 backdrop-blur-[1px]">
        {initials}
      </span>
    </div>
  );
};

export default function App() {
  // Navigation & Responsive Drawer State
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [activeMatchId, setActiveMatchId] = useState<string>('m-ars-bha');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSlipOpen, setMobileSlipOpen] = useState(false);
  const [simulatorExpandedMobile, setSimulatorExpandedMobile] = useState(false);

  // Data & Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(1450.0);
  const [matches, setMatches] = useState<MatchFixture[]>(INITIAL_MATCHES);
  const [matchMarkets, setMatchMarkets] = useState<MarketGroupItem[]>(ARSENAL_BRIGHTON_MARKETS);
  const [collapsedMarkets, setCollapsedMarkets] = useState<string[]>([]);
  const [myBets, setMyBets] = useState<PlacedBet[]>(INITIAL_MY_BETS);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [matchMarketTab, setMatchMarketTab] = useState<string>('All Markets');
  const [followedItems, setFollowedItems] = useState<string[]>([
    'Premier League',
    'Arsenal',
    'Champions League',
  ]);
  const [showFollowedOnly, setShowFollowedOnly] = useState(false);

  // Live Clock Ticker for Arsenal v Brighton (64:18+)
  const [matchSeconds, setMatchSeconds] = useState<number>(64 * 60 + 18);

  // Bet Slip & Edge State Controls
  const [slipTab, setSlipTab] = useState<SlipTab>('slip');
  const [myBetsFilter, setMyBetsFilter] = useState<MyBetsFilter>('open');
  const [selectedOdd, setSelectedOdd] = useState<OddOption | null>(
    INITIAL_MATCHES[0].markets1X2.home
  );
  const [stake, setStake] = useState<string>('25');

  // Judge's Edge-State Simulator Toggles
  const [oddsChangedState, setOddsChangedState] = useState<{
    active: boolean;
    oldOdds: number;
    newOdds: number;
  }>({ active: false, oldOdds: 1.42, newOdds: 1.55 });
  const [selectionSuspended, setSelectionSuspended] = useState<boolean>(false);
  const [simulateBetFail, setSimulateBetFail] = useState<boolean>(false);
  const [forceNothingLive, setForceNothingLive] = useState<boolean>(false);

  // Bet Placement Feedback States
  const [isPlacingBet, setIsPlacingBet] = useState<boolean>(false);
  const [betPlacedSuccess, setBetPlacedSuccess] = useState<PlacedBet | null>(null);
  const [betFailedError, setBetFailedError] = useState<string | null>(null);
  const [cashingOutId, setCashingOutId] = useState<string | null>(null);

  const currentMatch = useMemo(
    () => matches.find((m) => m.id === activeMatchId) || matches[0],
    [matches, activeMatchId]
  );

  // 1. Live Match Clock Second Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setMatchSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedArsenalClock = useMemo(() => {
    const mins = Math.floor(matchSeconds / 60);
    const secs = matchSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, [matchSeconds]);

  // 2. Background Live Odds & Cash-Out Volatility Ticker (Every 6 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prevMatches) =>
        prevMatches.map((m, idx) => {
          if (!m.isLive || idx > 2) return m;
          const delta = Math.random() > 0.5 ? 0.04 : -0.04;
          const prevVal = m.markets1X2.home.odds;
          const nextVal = Number(Math.max(1.08, prevVal + delta).toFixed(2));
          const direction: 'up' | 'down' = nextVal >= prevVal ? 'up' : 'down';

          return {
            ...m,
            markets1X2: {
              ...m.markets1X2,
              home: {
                ...m.markets1X2.home,
                prevOdds: prevVal,
                odds: nextVal,
                direction,
              },
            },
          };
        })
      );

      setMatchMarkets((prevGroups) =>
        prevGroups.map((group, gIdx) => {
          if (group.suspended || gIdx > 2) return group;
          return {
            ...group,
            options: group.options.map((opt, oIdx) => {
              if (oIdx !== 0) return { ...opt, direction: null };
              const delta = Math.random() > 0.48 ? 0.05 : -0.05;
              const nextVal = Number(Math.max(1.1, opt.odds + delta).toFixed(2));
              return {
                ...opt,
                prevOdds: opt.odds,
                odds: nextVal,
                direction: nextVal >= opt.odds ? 'up' : 'down',
              };
            }),
          };
        })
      );

      // Subtly tick open Cash Out offers in My Bets
      setMyBets((prevBets) =>
        prevBets.map((bet) => {
          if (bet.status !== 'open' || !bet.cashOutValue) return bet;
          const nudge = Math.random() > 0.48 ? 0.35 : -0.3;
          const updatedCashOut = Number(Math.max(bet.stake * 0.4, bet.cashOutValue + nudge).toFixed(2));
          return { ...bet, cashOutValue: updatedCashOut };
        })
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Follow / Star Toggle
  const toggleFollow = (name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFollowedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  // Toggle Market Accordion Collapse
  const toggleMarketCollapse = (marketId: string) => {
    setCollapsedMarkets((prev) =>
      prev.includes(marketId) ? prev.filter((id) => id !== marketId) : [...prev, marketId]
    );
  };

  // Open specific match on Match Page
  const openMatchPage = (matchId: string) => {
    setActiveMatchId(matchId);
    setActivePage('match');
  };

  // Select Odd Handler
  const handleSelectOdd = (option: OddOption, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (option.suspended) return;

    setBetPlacedSuccess(null);
    setBetFailedError(null);

    if (selectedOdd?.id === option.id) {
      setSelectedOdd(null);
      setOddsChangedState({ active: false, oldOdds: 0, newOdds: 0 });
    } else {
      setSelectedOdd(option);
      setOddsChangedState({ active: false, oldOdds: option.odds, newOdds: option.odds });
      setSlipTab('slip');
    }
  };

  // Judge's Simulator: Trigger Odds Change
  const triggerOddsChange = () => {
    setBetPlacedSuccess(null);
    setBetFailedError(null);

    const baseOdd = selectedOdd || INITIAL_MATCHES[0].markets1X2.home;
    if (!selectedOdd) setSelectedOdd(baseOdd);

    const oldPrice = baseOdd.odds;
    const delta = Math.random() > 0.35 ? 0.16 : -0.14;
    const newPrice = Number(Math.max(1.15, oldPrice + delta).toFixed(2));

    setOddsChangedState({
      active: true,
      oldOdds: oldPrice,
      newOdds: newPrice,
    });

    setSelectedOdd({
      ...baseOdd,
      prevOdds: oldPrice,
      odds: newPrice,
      direction: newPrice > oldPrice ? 'up' : 'down',
    });

    setMatchMarkets((prev) =>
      prev.map((g) => ({
        ...g,
        options: g.options.map((o) => {
          const d = Math.random() > 0.5 ? 0.1 : -0.08;
          const nv = Number(Math.max(1.1, o.odds + d).toFixed(2));
          return { ...o, prevOdds: o.odds, odds: nv, direction: nv >= o.odds ? 'up' : 'down' };
        }),
      }))
    );
  };

  // Judge's Simulator: Toggle Market Suspended
  const toggleMarketSuspension = () => {
    const nextSuspended = !selectionSuspended;
    setSelectionSuspended(nextSuspended);
    setBetPlacedSuccess(null);
    setBetFailedError(null);

    if (!selectedOdd) {
      setSelectedOdd(INITIAL_MATCHES[0].markets1X2.home);
    }

    setMatchMarkets((prev) =>
      prev.map((g, idx) =>
        idx === 1 || idx === 3 || g.id === 'mkt-cards'
          ? {
              ...g,
              suspended: nextSuspended,
              options: g.options.map((o) => ({ ...o, suspended: nextSuspended })),
            }
          : g
      )
    );
  };

  const handleAcceptNewOdds = () => {
    setOddsChangedState((prev) => ({ ...prev, active: false }));
  };

  const handlePlaceBet = () => {
    if (!selectedOdd || selectionSuspended || oddsChangedState.active) return;
    const numericStake = parseFloat(stake) || 0;

    if (numericStake <= 0) {
      setBetFailedError('Enter a valid stake amount in USDT.');
      return;
    }

    setIsPlacingBet(true);
    setBetFailedError(null);
    setBetPlacedSuccess(null);

    setTimeout(() => {
      setIsPlacingBet(false);

      if (simulateBetFail || numericStake > walletBalance) {
        setBetFailedError(
          numericStake > walletBalance
            ? `Bet Failed: Insufficient USDT balance (${walletBalance.toFixed(2)} USDT available).`
            : 'Bet Failed: Market price rejected by risk engine. Your USDT balance was not charged.'
        );
        return;
      }

      const potentialReturn = Number((numericStake * selectedOdd.odds).toFixed(2));
      const newBet: PlacedBet = {
        id: `hb-${Math.floor(10000 + Math.random() * 89999)}`,
        selectionId: selectedOdd.id,
        selectionLabel: selectedOdd.label,
        marketName: selectedOdd.marketName,
        matchTitle: selectedOdd.matchTitle,
        league: selectedOdd.league,
        isLive: true,
        matchScore:
          selectedOdd.matchId === 'm-ars-bha'
            ? `2 - 1 (${Math.floor(matchSeconds / 60)}')`
            : 'Live',
        odds: selectedOdd.odds,
        stake: numericStake,
        potentialReturn,
        status: 'open',
        cashOutValue: Number((numericStake * 0.92).toFixed(2)),
        placedAt: 'Just now',
      };

      setWalletBalance((prev) => Number((prev - numericStake).toFixed(2)));
      setMyBets((prev) => [newBet, ...prev]);
      setBetPlacedSuccess(newBet);
    }, 550);
  };

  const handleCashOut = (bet: PlacedBet) => {
    if (!bet.cashOutValue) return;
    setCashingOutId(bet.id);
    setTimeout(() => {
      setWalletBalance((prev) => Number((prev + (bet.cashOutValue || 0)).toFixed(2)));
      setMyBets((prev) =>
        prev.map((item) => (item.id === bet.id ? { ...item, status: 'cashed_out' } : item))
      );
      setCashingOutId(null);
    }, 450);
  };

  // Adapt Match Page markets dynamically if user clicked another fixture
  const displayedMatchMarkets = useMemo(() => {
    if (currentMatch.id === 'm-ars-bha') return matchMarkets;
    return matchMarkets.map((group) => ({
      ...group,
      title: group.title
        .replace('Arsenal', currentMatch.homeTeam)
        .replace('Brighton', currentMatch.awayTeam),
      options: group.options.map((opt) => ({
        ...opt,
        id: `${currentMatch.id}-${opt.id}`,
        matchId: currentMatch.id,
        matchTitle: `${currentMatch.homeTeam} v ${currentMatch.awayTeam}`,
        league: currentMatch.competitionName,
        label: opt.label
          .replace('Arsenal', currentMatch.homeTeam)
          .replace('Brighton', currentMatch.awayTeam),
      })),
    }));
  }, [matchMarkets, currentMatch]);

  // Search Results Calculation
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const matchedMatches = matches
      .filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(q) ||
          m.awayTeam.toLowerCase().includes(q) ||
          m.competitionName.toLowerCase().includes(q)
      )
      .map((m) => ({
        type: m.isLive ? 'Live Match' : 'Fixture',
        name: `${m.homeTeam} v ${m.awayTeam}`,
        detail: `${m.competitionName} • ${
          m.isLive ? `${m.homeScore}-${m.awayScore} (${m.minute}')` : m.kickoff
        }`,
        action: () => {
          openMatchPage(m.id);
          setSearchQuery('');
          setSearchFocused(false);
        },
      }));

    const matchedExtras = SEARCHABLE_PLAYERS_AND_MARKETS.filter(
      (item) => item.name.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q)
    ).map((item) => ({
      type: item.type,
      name: item.name,
      detail: item.detail,
      action: () => {
        openMatchPage('m-ars-bha');
        if (item.name.toLowerCase().includes('corner')) setMatchMarketTab('Corners & cards');
        else if (item.name.toLowerCase().includes('handicap')) setMatchMarketTab('Handicaps');
        else if (item.type === 'Player') setMatchMarketTab('Goalscorers');
        setSearchQuery('');
        setSearchFocused(false);
      },
    }));

    return [...matchedMatches, ...matchedExtras].slice(0, 7);
  }, [searchQuery, matches]);

  const liveMatches = useMemo(() => {
    if (forceNothingLive) return [];
    return matches.filter((m) => {
      if (!m.isLive) return false;
      if (selectedSport !== 'all' && m.sport !== selectedSport) return false;
      if (selectedCompetition !== 'all' && m.competitionId !== selectedCompetition) return false;
      return true;
    });
  }, [matches, forceNothingLive, selectedSport, selectedCompetition]);

  const startingSoonMatches = useMemo(() => matches.filter((m) => !m.isLive), [matches]);

  const openBetsCount = useMemo(
    () => myBets.filter((b) => b.status === 'open').length,
    [myBets]
  );

  // Reusable Odd Button Component
  const renderOddButton = (opt: OddOption, compact = false) => {
    const isSelected = selectedOdd?.id === opt.id;
    const isSuspended = opt.suspended || (selectionSuspended && isSelected);
    const flashClass =
      opt.direction === 'up'
        ? 'odd-flash-up'
        : opt.direction === 'down'
        ? 'odd-flash-down'
        : '';

    return (
      <button
        key={opt.id}
        onClick={(e) => handleSelectOdd(opt, e)}
        disabled={isSuspended}
        className={`group relative flex items-center justify-between rounded-lg border transition-all duration-150 select-none ${
          compact ? 'px-2.5 py-2 min-w-[78px]' : 'px-3.5 py-2.5 w-full'
        } ${flashClass} ${
          isSuspended
            ? 'bg-[#151B26] border-[#222B3A] text-slate-600 cursor-not-allowed'
            : isSelected
            ? 'bg-[#00E701] border-[#00E701] text-[#0B0E14] font-bold shadow-[0_0_15px_rgba(0,231,1,0.28)]'
            : 'bg-[#232D3F] border-[#2E3A52] hover:bg-[#2C384E] hover:border-slate-500 text-slate-100'
        }`}
      >
        <span
          className={`text-xs truncate mr-1.5 ${
            isSelected ? 'text-[#0B0E14] font-bold' : 'text-slate-400 group-hover:text-slate-200'
          }`}
        >
          {opt.subLabel || opt.label}
        </span>

        {isSuspended ? (
          <Lock className="w-3.5 h-3.5 text-rose-400/80 shrink-0" />
        ) : (
          <span className="flex items-center gap-0.5 font-mono text-xs sm:text-sm font-bold tabular-nums">
            {opt.direction === 'up' && (
              <ArrowUpRight
                className={`w-3 h-3 ${isSelected ? 'text-[#0B0E14]' : 'text-emerald-400'}`}
              />
            )}
            {opt.direction === 'down' && (
              <ArrowDownRight
                className={`w-3 h-3 ${isSelected ? 'text-[#0B0E14]' : 'text-rose-400'}`}
              />
            )}
            {opt.odds.toFixed(2)}
          </span>
        )}
      </button>
    );
  };

  // Reusable Match Row Card
  const renderMatchRow = (match: MatchFixture) => {
    const isHomeFollowed = followedItems.includes(match.homeTeam);
    const isAwayFollowed = followedItems.includes(match.awayTeam);

    return (
      <div
        key={match.id}
        onClick={() => openMatchPage(match.id)}
        className="group bg-[#181F2C] hover:bg-[#1F293A] border border-[#222B3A] rounded-xl p-3 sm:p-3.5 transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-14 sm:w-16 shrink-0 flex flex-col items-center justify-center border-r border-[#263042] pr-2.5">
            {match.isLive ? (
              <>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 text-[10px] font-bold tracking-wider uppercase mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  LIVE
                </span>
                <span className="font-mono text-xs font-bold text-[#00E701] tabular-nums">
                  {match.id === 'm-ars-bha' ? formattedArsenalClock : `${match.minute}'`}
                </span>
              </>
            ) : (
              <span className="font-mono text-[11px] text-slate-400 text-center leading-tight tabular-nums">
                {match.kickoff}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <TeamCrest name={match.homeTeam} colors={match.homeColors} />
                <span className="text-sm font-semibold text-slate-100 truncate group-hover:text-white">
                  {match.homeTeam}
                </span>
                <button
                  onClick={(e) => toggleFollow(match.homeTeam, e)}
                  title={`Follow ${match.homeTeam}`}
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      isHomeFollowed ? 'fill-amber-400 text-amber-400' : ''
                    }`}
                  />
                </button>
              </div>
              {match.isLive && (
                <span className="font-mono text-sm font-bold text-white bg-[#121721] px-2 py-0.5 rounded border border-[#263042] tabular-nums">
                  {match.homeScore}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <TeamCrest name={match.awayTeam} colors={match.awayColors} />
                <span className="text-sm font-semibold text-slate-100 truncate group-hover:text-white">
                  {match.awayTeam}
                </span>
                <button
                  onClick={(e) => toggleFollow(match.awayTeam, e)}
                  title={`Follow ${match.awayTeam}`}
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      isAwayFollowed ? 'fill-amber-400 text-amber-400' : ''
                    }`}
                  />
                </button>
              </div>
              {match.isLive && (
                <span className="font-mono text-sm font-bold text-white bg-[#121721] px-2 py-0.5 rounded border border-[#263042] tabular-nums">
                  {match.awayScore}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full lg:w-[270px] shrink-0">
          {renderOddButton(match.markets1X2.home, true)}
          {match.markets1X2.draw ? (
            renderOddButton(match.markets1X2.draw, true)
          ) : (
            <div className="flex items-center justify-center text-[11px] text-slate-600 bg-[#141A24] rounded-lg border border-[#1E2636]">
              2-Way
            </div>
          )}
          {renderOddButton(match.markets1X2.away, true)}
        </div>
      </div>
    );
  };

  // UNIFIED PAGE 5: BET SLIP + MY BETS COMPONENT
  const renderUnifiedBetSlipAndMyBets = () => {
    const numericStake = parseFloat(stake) || 0;
    const potentialReturn = selectedOdd ? (numericStake * selectedOdd.odds).toFixed(2) : '0.00';

    const filteredMyBets = myBets.filter((b) => {
      if (myBetsFilter === 'open') return b.status === 'open';
      if (myBetsFilter === 'settled')
        return b.status === 'won' || b.status === 'lost' || b.status === 'cashed_out';
      if (myBetsFilter === 'cashout') return b.status === 'open' && b.cashOutValue;
      return true;
    });

    return (
      <div className="flex flex-col h-full bg-[#121721] text-slate-100 select-none">
        <div className="p-3 border-b border-[#222B3A] bg-[#0F141D]">
          <div className="grid grid-cols-2 gap-1 bg-[#181F2C] p-1 rounded-xl border border-[#222B3A]">
            <button
              onClick={() => setSlipTab('slip')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                slipTab === 'slip'
                  ? 'bg-[#00E701] text-[#0B0E14] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Bet Slip</span>
              {selectedOdd && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    slipTab === 'slip' ? 'bg-[#0B0E14] text-[#00E701]' : 'bg-[#232D3F] text-white'
                  }`}
                >
                  1
                </span>
              )}
            </button>

            <button
              onClick={() => setSlipTab('mybets')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                slipTab === 'mybets'
                  ? 'bg-[#00E701] text-[#0B0E14] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>My Bets</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  slipTab === 'mybets'
                    ? 'bg-[#0B0E14] text-[#00E701]'
                    : 'bg-[#232D3F] text-[#00E701]'
                }`}
              >
                {openBetsCount}
              </span>
            </button>
          </div>
        </div>

        {slipTab === 'slip' ? (
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 bg-[#181F2C] px-3 py-1.5 rounded-lg border border-[#222B3A]">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00E701]" />
                Singles Only
              </span>
              <span className="font-mono text-slate-400">Currency: USDT</span>
            </div>

            {betPlacedSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Bet Placed Successfully</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-300/80">
                    #{betPlacedSuccess.id}
                  </span>
                </div>

                <div className="bg-[#121721]/90 rounded-lg p-3 border border-emerald-500/20 space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-white">
                    <span>{betPlacedSuccess.selectionLabel}</span>
                    <span className="font-mono text-[#00E701] tabular-nums">
                      @{betPlacedSuccess.odds.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {betPlacedSuccess.marketName} • {betPlacedSuccess.matchTitle}
                  </div>
                  <div className="pt-2 border-t border-[#222B3A] flex justify-between font-mono text-xs tabular-nums">
                    <span className="text-slate-400">
                      Stake: {betPlacedSuccess.stake.toFixed(2)} USDT
                    </span>
                    <span className="text-emerald-400 font-bold">
                      Return: {betPlacedSuccess.potentialReturn.toFixed(2)} USDT
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setBetPlacedSuccess(null);
                      setSlipTab('mybets');
                      setMyBetsFilter('open');
                    }}
                    className="py-2 px-3 rounded-lg bg-[#00E701] text-[#0B0E14] font-bold text-xs hover:brightness-110 transition"
                  >
                    View in My Bets
                  </button>
                  <button
                    onClick={() => setBetPlacedSuccess(null)}
                    className="py-2 px-3 rounded-lg bg-[#232D3F] text-slate-200 font-semibold text-xs hover:bg-[#2C384E] transition"
                  >
                    Keep Betting
                  </button>
                </div>
              </div>
            )}

            {!selectedOdd ? (
              <div className="py-12 px-4 text-center border border-dashed border-[#263042] rounded-xl space-y-2">
                <Receipt className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">Your bet slip is empty</p>
                <p className="text-xs text-slate-500">
                  Tap any decimal odd across Live or Upcoming matches to add a single selection.
                </p>
              </div>
            ) : (
              <div
                className={`rounded-xl border p-3.5 space-y-3 transition-all ${
                  selectionSuspended
                    ? 'bg-rose-950/15 border-rose-500/40'
                    : oddsChangedState.active
                    ? 'bg-amber-950/15 border-amber-500/50'
                    : 'bg-[#181F2C] border-[#263042]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{selectedOdd.label}</span>
                      {selectionSuspended && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase">
                          <Lock className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedOdd.marketName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{selectedOdd.matchTitle}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right font-mono tabular-nums">
                      {oddsChangedState.active && (
                        <span className="block text-[11px] text-slate-500 line-through">
                          {oddsChangedState.oldOdds.toFixed(2)}
                        </span>
                      )}
                      <span
                        className={`text-base font-extrabold ${
                          selectionSuspended
                            ? 'text-slate-500'
                            : oddsChangedState.active
                            ? 'text-amber-400'
                            : 'text-[#00E701]'
                        }`}
                      >
                        {selectedOdd.odds.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedOdd(null);
                        setOddsChangedState({ active: false, oldOdds: 0, newOdds: 0 });
                        setBetFailedError(null);
                      }}
                      className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-white/5"
                      title="Remove selection"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {oddsChangedState.active && !selectionSuspended && (
                  <div className="bg-amber-500/15 border border-amber-500/40 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">
                        Odds changed from {oddsChangedState.oldOdds.toFixed(2)} to{' '}
                        {oddsChangedState.newOdds.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-amber-200/80">
                        You must accept the updated price before placing your bet.
                      </span>
                    </div>
                  </div>
                )}

                {selectionSuspended && (
                  <div className="bg-rose-500/15 border border-rose-500/40 rounded-lg p-2.5 flex items-center gap-2 text-xs text-rose-300">
                    <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Market temporarily suspended due to live match event.</span>
                  </div>
                )}

                {/* USDT Stake Input + Additive Quick Chips + MAX */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Stake Amount</span>
                    <button
                      onClick={() => setStake('0')}
                      className="text-slate-500 hover:text-slate-300 font-mono text-[10px]"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min="1"
                      step="5"
                      disabled={selectionSuspended}
                      value={stake}
                      onChange={(e) => {
                        setStake(e.target.value);
                        setBetFailedError(null);
                      }}
                      placeholder="0.00"
                      className="w-full bg-[#0F141D] border border-[#2E3A52] focus:border-[#00E701] rounded-lg px-3 py-2.5 pr-16 font-mono text-sm font-bold text-white outline-none transition disabled:opacity-50 tabular-nums"
                    />
                    <span className="absolute right-3 font-mono text-xs font-bold text-[#00E701]">
                      USDT
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {[10, 25, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        disabled={selectionSuspended}
                        onClick={() => {
                          const current = parseFloat(stake) || 0;
                          setStake(String(current + amt));
                          setBetFailedError(null);
                        }}
                        className="py-1.5 rounded bg-[#232D3F] hover:bg-[#2C384E] text-xs font-mono font-semibold text-slate-200 border border-[#2E3A52] transition disabled:opacity-40"
                      >
                        +{amt}
                      </button>
                    ))}
                    <button
                      disabled={selectionSuspended}
                      onClick={() => {
                        setStake(String(Math.floor(walletBalance)));
                        setBetFailedError(null);
                      }}
                      className="py-1.5 rounded bg-[#182625] hover:bg-[#1F3532] text-xs font-mono font-bold text-[#00E701] border border-[#00E701]/30 transition disabled:opacity-40"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#222B3A] space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Stake</span>
                    <span className="font-mono tabular-nums">{numericStake.toFixed(2)} USDT</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Decimal Odds</span>
                    <span className="font-mono tabular-nums">{selectedOdd.odds.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1">
                    <span>Potential Return</span>
                    <span className="font-mono text-[#00E701] tabular-nums">
                      {potentialReturn} USDT
                    </span>
                  </div>
                </div>

                {betFailedError && (
                  <div className="bg-rose-950/60 border border-rose-500/50 rounded-lg p-2.5 flex items-start gap-2 text-xs text-rose-200">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">{betFailedError}</p>
                    </div>
                  </div>
                )}

                {selectionSuspended ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-slate-800 text-slate-500 font-bold text-sm border border-slate-700 cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Selection Suspended
                  </button>
                ) : oddsChangedState.active ? (
                  <button
                    onClick={handleAcceptNewOdds}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0B0E14] font-extrabold text-sm shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Accept New Odds ({selectedOdd.odds.toFixed(2)})
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceBet}
                    disabled={isPlacingBet}
                    className="w-full py-3 rounded-xl bg-[#00E701] hover:brightness-110 text-[#0B0E14] font-extrabold text-sm shadow-[0_0_20px_rgba(0,231,1,0.3)] transition flex items-center justify-center gap-2"
                  >
                    {isPlacingBet ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        Verifying on Housebets...
                      </>
                    ) : (
                      <>Place Single Bet • {numericStake.toFixed(2)} USDT</>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            <div className="grid grid-cols-3 gap-1.5 bg-[#181F2C] p-1 rounded-lg border border-[#222B3A]">
              {(['open', 'settled', 'cashout'] as MyBetsFilter[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMyBetsFilter(tab)}
                  className={`py-1.5 rounded-md text-xs font-semibold capitalize transition ${
                    myBetsFilter === tab
                      ? 'bg-[#232D3F] text-[#00E701] border border-[#2E3A52]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'cashout' ? 'Cash Out' : tab}
                </button>
              ))}
            </div>

            {filteredMyBets.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500">
                No bets in this category right now.
              </div>
            ) : (
              filteredMyBets.map((bet) => (
                <div
                  key={bet.id}
                  className="bg-[#181F2C] border border-[#222B3A] rounded-xl p-3.5 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{bet.selectionLabel}</span>
                        {bet.status === 'open' && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase">
                            Open
                          </span>
                        )}
                        {bet.status === 'won' && (
                          <span className="px-1.5 py-0.5 rounded bg-[#00E701]/20 text-[#00E701] text-[10px] font-bold uppercase">
                            Won
                          </span>
                        )}
                        {bet.status === 'lost' && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 text-[10px] font-bold uppercase">
                            Lost
                          </span>
                        )}
                        {bet.status === 'cashed_out' && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">
                            Cashed Out
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{bet.marketName}</p>
                      <p className="text-[11px] text-slate-500">
                        {bet.matchTitle} • <span className="text-slate-300">{bet.matchScore}</span>
                      </p>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#00E701] tabular-nums">
                      @{bet.odds.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#222B3A] grid grid-cols-2 gap-2 text-xs font-mono tabular-nums">
                    <div>
                      <span className="text-slate-500 block text-[10px]">STAKE</span>
                      <span className="text-slate-200 font-semibold">
                        {bet.stake.toFixed(2)} USDT
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">
                        {bet.status === 'cashed_out' ? 'CASHED OUT' : 'POTENTIAL RETURN'}
                      </span>
                      <span className="text-[#00E701] font-bold">
                        {(bet.status === 'cashed_out'
                          ? bet.cashOutValue || bet.stake
                          : bet.potentialReturn
                        ).toFixed(2)}{' '}
                        USDT
                      </span>
                    </div>
                  </div>

                  {bet.status === 'open' && bet.cashOutValue && (
                    <button
                      onClick={() => handleCashOut(bet)}
                      disabled={cashingOutId === bet.id}
                      className="w-full py-2 px-3 rounded-lg bg-[#232D3F] hover:bg-[#00E701] hover:text-[#0B0E14] text-[#00E701] border border-[#00E701]/40 font-mono text-xs font-bold transition flex items-center justify-between tabular-nums"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E701] animate-pulse" />
                        {cashingOutId === bet.id ? 'Processing Cash Out...' : 'Cash Out Live'}
                      </span>
                      <span>{bet.cashOutValue.toFixed(2)} USDT</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100">
      {/* JUDGE'S INTERACTIVE EDGE-STATE SIMULATOR BAR (Collapsible on 390px Mobile) */}
      <div className="bg-[#141B29] border-b border-[#263248] px-3 py-1.5 text-xs z-40">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#00E701]/15 text-[#00E701] font-mono text-[11px] font-bold">
              <SlidersHorizontal className="w-3 h-3" />
              STATE CONTROLS
            </span>
            <span className="text-slate-400 hidden md:inline text-[11px]">
              Test every required scorecard edge state instantly:
            </span>
          </div>

          <button
            onClick={() => setSimulatorExpandedMobile(!simulatorExpandedMobile)}
            className="sm:hidden px-2 py-0.5 rounded bg-[#1D2638] text-slate-300 font-mono text-[10px] border border-[#2E3A52]"
          >
            {simulatorExpandedMobile ? 'Hide Controls' : 'Test Edge States (4)'}
          </button>

          <div
            className={`${
              simulatorExpandedMobile ? 'flex' : 'hidden'
            } sm:flex flex-wrap items-center gap-1.5 mt-2 sm:mt-0 w-full sm:w-auto`}
          >
            <button
              onClick={triggerOddsChange}
              className={`px-2.5 py-1 rounded-md font-medium text-[11px] border transition ${
                oddsChangedState.active
                  ? 'bg-amber-500 text-[#0B0E14] border-amber-400 font-bold'
                  : 'bg-[#1D2638] hover:bg-[#27324A] text-amber-300 border-amber-500/30'
              }`}
            >
              1. Trigger Odds Change
            </button>

            <button
              onClick={toggleMarketSuspension}
              className={`px-2.5 py-1 rounded-md font-medium text-[11px] border transition ${
                selectionSuspended
                  ? 'bg-rose-500 text-white border-rose-400 font-bold'
                  : 'bg-[#1D2638] hover:bg-[#27324A] text-rose-300 border-rose-500/30'
              }`}
            >
              2. {selectionSuspended ? 'Unsuspend Markets' : 'Suspend Market'}
            </button>

            <button
              onClick={() => setSimulateBetFail((prev) => !prev)}
              className={`px-2.5 py-1 rounded-md font-medium text-[11px] border transition ${
                simulateBetFail
                  ? 'bg-rose-600 text-white border-rose-400 font-bold'
                  : 'bg-[#1D2638] hover:bg-[#27324A] text-slate-300 border-slate-600'
              }`}
            >
              3. Simulate Bet Failed: {simulateBetFail ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => {
                setForceNothingLive((prev) => !prev);
                setActivePage('live');
              }}
              className={`px-2.5 py-1 rounded-md font-medium text-[11px] border transition ${
                forceNothingLive
                  ? 'bg-cyan-400 text-[#0B0E14] border-cyan-300 font-bold'
                  : 'bg-[#1D2638] hover:bg-[#27324A] text-cyan-300 border-cyan-500/30'
              }`}
            >
              4. "Nothing Live" Fallback: {forceNothingLive ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* TOP BAR SHELL */}
      <header className="sticky top-0 z-30 h-16 bg-[#121721]/95 backdrop-blur-md border-b border-[#222B3A] px-3 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 lg:gap-7">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#181F2C] text-slate-300 hover:text-white border border-[#222B3A]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#00E701] flex items-center justify-center shadow-[0_0_15px_rgba(0,231,1,0.35)]">
              <span className="font-mono font-black text-lg text-[#0B0E14] tracking-tighter">
                HB
              </span>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                HOUSE<span className="text-[#00E701]">BETS</span>
              </span>
              <span className="block text-[9px] font-mono uppercase tracking-widest text-slate-400 -mt-1">
                SPORTSBOOK
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'home', label: 'Sports Home' },
              { id: 'live', label: 'Live', badge: liveMatches.length },
              { id: 'football', label: 'Football' },
              { id: 'match', label: 'Match Page (ARS v BHA)' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'match') setActiveMatchId('m-ars-bha');
                  setActivePage(item.id as ActivePage);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activePage === item.id
                    ? 'bg-[#181F2C] text-[#00E701] border border-[#263248]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[10px]">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2.5 flex-1 max-w-md justify-end">
          <div className="relative flex-1 max-w-xs">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teams, players, markets..."
                className="w-full bg-[#181F2C] border border-[#263042] focus:border-[#00E701] rounded-xl pl-9 pr-7 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-[#181F2C] border border-[#2E3A52] rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-3 py-1.5 bg-[#121721] text-[10px] font-mono uppercase text-slate-400 border-b border-[#222B3A]">
                  Instant Results (Teams, Players, Competitions, Markets)
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-xs text-slate-400 text-center">
                    No matches found for "{searchQuery}"
                  </div>
                ) : (
                  searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      onMouseDown={res.action}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-[#232D3F] border-b border-[#222B3A]/60 last:border-none flex items-center justify-between gap-2 transition"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{res.name}</div>
                        <div className="text-[11px] text-slate-400">{res.detail}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#121721] text-[#00E701] font-mono text-[10px]">
                        {res.type}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 bg-[#181F2C] border border-[#263042] px-3 py-1.5 rounded-xl shrink-0">
            <Wallet className="w-4 h-4 text-[#00E701]" />
            <div className="text-right font-mono tabular-nums">
              <span className="text-xs sm:text-sm font-extrabold text-white">
                {walletBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-[11px] font-bold text-[#00E701] ml-1">USDT</span>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE QUICK NAVIGATION STRIP (390px) */}
      <div className="md:hidden bg-[#121721] border-b border-[#222B3A] px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'home', label: 'Sports Home' },
          { id: 'live', label: `Live (${liveMatches.length})` },
          { id: 'football', label: 'Football' },
          { id: 'match', label: 'Arsenal v Brighton' },
          { id: 'betslip-mobile', label: `Slip & My Bets (${openBetsCount})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              if (t.id === 'match') setActiveMatchId('m-ars-bha');
              setActivePage(t.id as ActivePage);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activePage === t.id
                ? 'bg-[#00E701] text-[#0B0E14]'
                : 'bg-[#181F2C] text-slate-300 border border-[#222B3A]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 3-COLUMN SITE SHELL */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto relative">
        <aside
          className={`${
            mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 w-64 block' : 'hidden'
          } lg:block lg:w-[240px] shrink-0 bg-[#121721] border-r border-[#222B3A] p-3.5 space-y-5 overflow-y-auto`}
        >
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5">
              Navigation
            </div>
            {[
              { id: 'home', label: 'Sports Home', icon: Trophy },
              { id: 'live', label: 'Live In-Play', icon: Flame, count: liveMatches.length },
              { id: 'football', label: 'Football Hub', icon: Shield },
              { id: 'match', label: 'Arsenal v Brighton', icon: Activity, highlight: true },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'match') setActiveMatchId('m-ars-bha');
                    setActivePage(item.id as ActivePage);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activePage === item.id
                      ? 'bg-[#00E701] text-[#0B0E14]'
                      : item.highlight
                      ? 'bg-[#181F2C] text-[#00E701] border border-[#00E701]/30 hover:bg-[#1F293A]'
                      : 'text-slate-300 hover:bg-[#181F2C] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded font-mono text-[10px] ${
                        activePage === item.id
                          ? 'bg-[#0B0E14] text-[#00E701]'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <div className="px-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              <span>Followed ({followedItems.length})</span>
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            </div>
            {followedItems.length === 0 ? (
              <p className="px-2 text-[11px] text-slate-500">
                Tap the star next to any club or league to follow.
              </p>
            ) : (
              <div className="space-y-1">
                {followedItems.map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      if (item === 'Arsenal' || item === 'Brighton') openMatchPage('m-ars-bha');
                      else setActivePage('football');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#181F2C] hover:bg-[#1F293A] text-xs text-slate-200 cursor-pointer border border-[#222B3A]"
                  >
                    <span className="truncate font-medium">{item}</span>
                    <button
                      onClick={(e) => toggleFollow(item, e)}
                      className="text-amber-400 hover:text-slate-400"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5">
              Top Competitions
            </div>
            {TOP_COMPETITIONS.map((comp) => (
              <button
                key={comp.id}
                onClick={() => {
                  setSelectedCompetition(comp.id);
                  setActivePage('football');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:bg-[#181F2C] hover:text-white transition"
              >
                <span className="truncate font-medium">{comp.name}</span>
                <span className="font-mono text-[10px] text-slate-500">{comp.country}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5">
              Sports A-Z
            </div>
            {SPORTS_LIST.map((sp) => (
              <button
                key={sp.id}
                onClick={() => {
                  setSelectedSport(sp.id);
                  setActivePage('home');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                  selectedSport === sp.id
                    ? 'bg-[#181F2C] text-[#00E701] font-bold'
                    : 'text-slate-400 hover:bg-[#181F2C] hover:text-white'
                }`}
              >
                <span>{sp.name}</span>
                <span className="font-mono text-[10px]">{sp.count}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* CENTER MAIN VIEWPORT */}
        <main className="flex-1 min-w-0 p-3.5 sm:p-5 pb-24 lg:pb-8 overflow-y-auto space-y-6">
          {activePage === 'home' && (
            <div className="space-y-6">
              <div
                onClick={() => openMatchPage('m-ars-bha')}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#172234] via-[#181F2C] to-[#121721] border border-[#2A364F] p-4 sm:p-5 cursor-pointer hover:border-[#00E701]/50 transition group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-extrabold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        FEATURED LIVE • {formattedArsenalClock}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        Premier League • Emirates Stadium
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-lg sm:text-xl font-extrabold text-white">
                      <span>Arsenal</span>
                      <span className="font-mono px-2.5 py-0.5 rounded-lg bg-[#0B0E14] text-[#00E701] border border-[#263248] tabular-nums">
                        2 - 1
                      </span>
                      <span>Brighton</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {INITIAL_MATCHES[0].goalSummary} • Tap to view all 6 live market groups
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:w-72 shrink-0">
                    {renderOddButton(matches[0].markets1X2.home)}
                    {matches[0].markets1X2.draw && renderOddButton(matches[0].markets1X2.draw)}
                    {renderOddButton(matches[0].markets1X2.away)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Sports Navigation
                </h2>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {SPORTS_LIST.map((sp) => (
                    <button
                      key={sp.id}
                      onClick={() => setSelectedSport(sp.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition flex items-center gap-2 ${
                        selectedSport === sp.id
                          ? 'bg-[#00E701] text-[#0B0E14] border-[#00E701]'
                          : 'bg-[#181F2C] text-slate-300 border-[#222B3A] hover:border-slate-600'
                      }`}
                    >
                      <span>{sp.name}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                          selectedSport === sp.id
                            ? 'bg-[#0B0E14] text-[#00E701]'
                            : 'bg-[#121721] text-slate-400'
                        }`}
                      >
                        {sp.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Top Competitions
                  </h2>
                  <button
                    onClick={() => setActivePage('football')}
                    className="text-xs text-[#00E701] hover:underline flex items-center gap-0.5 font-semibold"
                  >
                    View All Football <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
                  {TOP_COMPETITIONS.map((comp) => (
                    <div
                      key={comp.id}
                      onClick={() => {
                        setSelectedCompetition(comp.id);
                        setActivePage('football');
                      }}
                      className="bg-[#181F2C] hover:bg-[#1F293A] border border-[#222B3A] hover:border-slate-600 rounded-xl p-3 cursor-pointer transition flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-[#00E701] block">
                          {comp.country}
                        </span>
                        <span className="text-xs font-bold text-white truncate block">
                          {comp.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleFollow(comp.name, e)}
                        className="text-slate-500 hover:text-amber-400 p-1"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            followedItems.includes(comp.name)
                              ? 'fill-amber-400 text-amber-400'
                              : ''
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wide text-white">
                      Live Now ({liveMatches.length})
                    </h2>
                  </div>
                  <button
                    onClick={() => setActivePage('live')}
                    className="text-xs text-[#00E701] hover:underline font-semibold flex items-center gap-0.5"
                  >
                    All In-Play <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2.5">{liveMatches.map((m) => renderMatchRow(m))}</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00E701]" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-white">
                    Starting Soon
                  </h2>
                </div>
                <div className="space-y-2.5">
                  {startingSoonMatches.map((m) => renderMatchRow(m))}
                </div>
              </div>
            </div>
          )}

          {activePage === 'live' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B3A] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <h1 className="text-lg font-extrabold text-white">Live In-Play Matches</h1>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time scores, ticking match clocks, and instant decimal odds
                  </p>
                </div>

                <button
                  onClick={() => setForceNothingLive(!forceNothingLive)}
                  className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#181F2C] hover:bg-[#232D3F] border border-[#2E3A52] text-xs font-mono text-cyan-300 transition"
                >
                  {forceNothingLive ? 'Restore Live Feed' : 'Test "Nothing Live" State'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {SPORTS_LIST.map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => {
                      setSelectedSport(sp.id);
                      setSelectedCompetition('all');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedSport === sp.id
                        ? 'bg-[#00E701] text-[#0B0E14]'
                        : 'bg-[#181F2C] text-slate-300 border border-[#222B3A]'
                    }`}
                  >
                    {sp.name}
                  </button>
                ))}

                <span className="text-slate-600 mx-1">|</span>

                <button
                  onClick={() => setSelectedCompetition('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    selectedCompetition === 'all'
                      ? 'bg-[#232D3F] text-white border border-slate-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Competitions
                </button>
                {TOP_COMPETITIONS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCompetition(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      selectedCompetition === c.id
                        ? 'bg-[#232D3F] text-[#00E701] border border-[#00E701]/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {liveMatches.length > 0 ? (
                <div className="space-y-2.5">{liveMatches.map((m) => renderMatchRow(m))}</div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-[#181F2C] border border-[#263042] rounded-2xl p-6 text-center space-y-2">
                    <Clock className="w-8 h-8 text-[#00E701] mx-auto" />
                    <h3 className="text-base font-bold text-white">
                      Nothing live right now in this filter
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      No matches are currently in play for your selected filter. Check out the
                      fixtures <span className="text-[#00E701] font-semibold">Starting Soon</span>{' '}
                      below.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#00E701] flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Starting Soon
                    </h2>
                    <div className="space-y-2.5">
                      {startingSoonMatches.map((m) => renderMatchRow(m))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activePage === 'football' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B3A] pb-4">
                <div>
                  <h1 className="text-lg font-extrabold text-white">Football</h1>
                  <p className="text-xs text-slate-400">
                    Premier League, Champions League, LaLiga, Serie A, Bundesliga • Follow teams &
                    competitions
                  </p>
                </div>

                <button
                  onClick={() => setShowFollowedOnly(!showFollowedOnly)}
                  className={`self-start sm:self-auto px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
                    showFollowedOnly
                      ? 'bg-amber-400 text-[#0B0E14] border-amber-300'
                      : 'bg-[#181F2C] text-slate-300 border-[#222B3A]'
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      showFollowedOnly ? 'fill-[#0B0E14]' : 'text-amber-400'
                    }`}
                  />
                  <span>{showFollowedOnly ? 'Showing Followed Only' : 'Filter by Followed'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedCompetition('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedCompetition === 'all'
                      ? 'bg-[#00E701] text-[#0B0E14]'
                      : 'bg-[#181F2C] text-slate-300 border border-[#222B3A]'
                  }`}
                >
                  All Top 5 Leagues
                </button>
                {TOP_COMPETITIONS.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompetition(comp.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                      selectedCompetition === comp.id
                        ? 'bg-[#00E701] text-[#0B0E14]'
                        : 'bg-[#181F2C] text-slate-300 border border-[#222B3A]'
                    }`}
                  >
                    <span>{comp.name}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-5">
                {TOP_COMPETITIONS.filter(
                  (c) => selectedCompetition === 'all' || c.id === selectedCompetition
                ).map((comp) => {
                  const leagueMatches = matches.filter((m) => {
                    if (m.sport !== 'football' || m.competitionId !== comp.id) return false;
                    if (showFollowedOnly) {
                      return (
                        followedItems.includes(comp.name) ||
                        followedItems.includes(m.homeTeam) ||
                        followedItems.includes(m.awayTeam)
                      );
                    }
                    return true;
                  });

                  if (leagueMatches.length === 0) return null;
                  const isLeagueFollowed = followedItems.includes(comp.name);

                  return (
                    <div key={comp.id} className="space-y-2.5">
                      <div className="flex items-center justify-between bg-[#121721] px-3.5 py-2 rounded-xl border border-[#222B3A]">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2 py-0.5 rounded bg-[#181F2C] text-[#00E701] font-mono text-[10px] font-bold">
                            {comp.badge}
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-white">
                            {comp.name}
                          </span>
                          <span className="text-[11px] text-slate-500">({comp.country})</span>
                          <button
                            onClick={(e) => toggleFollow(comp.name, e)}
                            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 ml-1"
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                isLeagueFollowed ? 'fill-amber-400 text-amber-400' : ''
                              }`}
                            />
                            <span>{isLeagueFollowed ? 'Following' : 'Follow'}</span>
                          </button>
                        </div>

                        <div className="hidden lg:grid grid-cols-3 w-[270px] text-center font-mono text-[10px] text-slate-500 font-bold">
                          <span>1 (HOME)</span>
                          <span>X (DRAW)</span>
                          <span>2 (AWAY)</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {leagueMatches.map((m) => renderMatchRow(m))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PAGE 4: MATCH PAGE (20 PTS — PRIMARY TIEBREAKER) */}
          {activePage === 'match' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setActivePage('home')} className="hover:text-white">
                    Sports
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <button onClick={() => setActivePage('football')} className="hover:text-white">
                    {currentMatch.competitionName}
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-white font-semibold">
                    {currentMatch.homeTeam} v {currentMatch.awayTeam}
                  </span>
                </div>
                {currentMatch.id !== 'm-ars-bha' && (
                  <button
                    onClick={() => setActiveMatchId('m-ars-bha')}
                    className="font-mono text-[11px] text-[#00E701] hover:underline"
                  >
                    Switch to Arsenal v Brighton
                  </button>
                )}
              </div>

              <div className="rounded-2xl bg-gradient-to-b from-[#1A2333] to-[#121721] border border-[#2A364F] p-4 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  {currentMatch.isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-mono text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      LIVE •{' '}
                      {currentMatch.id === 'm-ars-bha'
                        ? formattedArsenalClock
                        : `${currentMatch.minute}'`}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#232D3F] text-[#00E701] font-mono text-xs font-bold">
                      {currentMatch.kickoff}
                    </span>
                  )}
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    {currentMatch.competitionName} • {currentMatch.period || 'Upcoming'}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center gap-2 sm:gap-6 py-2">
                  <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-2.5 text-center sm:text-right">
                    <div>
                      <div className="flex items-center justify-center sm:justify-end gap-1.5">
                        <button
                          onClick={(e) => toggleFollow(currentMatch.homeTeam, e)}
                          className="text-slate-400 hover:text-amber-400"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              followedItems.includes(currentMatch.homeTeam)
                                ? 'fill-amber-400 text-amber-400'
                                : ''
                            }`}
                          />
                        </button>
                        <span className="text-base sm:text-xl font-extrabold text-white">
                          {currentMatch.homeTeam}
                        </span>
                      </div>
                      {currentMatch.id === 'm-ars-bha' && (
                        <span className="text-[11px] text-slate-400 hidden sm:block">
                          Saka 14', Havertz 52'
                        </span>
                      )}
                    </div>
                    <TeamCrest
                      name={currentMatch.homeTeam}
                      colors={currentMatch.homeColors}
                      size="lg"
                    />
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 sm:gap-3 font-mono text-2xl sm:text-4xl font-black text-white bg-[#0B0E14] px-4 sm:px-6 py-2 rounded-2xl border border-[#2E3A52] tabular-nums shadow-inner">
                      <span>{currentMatch.isLive ? currentMatch.homeScore : '-'}</span>
                      <span className="text-[#00E701] text-xl">:</span>
                      <span>{currentMatch.isLive ? currentMatch.awayScore : '-'}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1.5 font-mono">
                      {currentMatch.isLive ? 'In-Play' : 'Pre-Match'}
                    </span>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-start gap-2.5 text-center sm:text-left">
                    <TeamCrest
                      name={currentMatch.awayTeam}
                      colors={currentMatch.awayColors}
                      size="lg"
                    />
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-1.5">
                        <span className="text-base sm:text-xl font-extrabold text-white">
                          {currentMatch.awayTeam}
                        </span>
                        <button
                          onClick={(e) => toggleFollow(currentMatch.awayTeam, e)}
                          className="text-slate-400 hover:text-amber-400"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              followedItems.includes(currentMatch.awayTeam)
                                ? 'fill-amber-400 text-amber-400'
                                : ''
                            }`}
                          />
                        </button>
                      </div>
                      {currentMatch.id === 'm-ars-bha' && (
                        <span className="text-[11px] text-slate-400 hidden sm:block">
                          Joao Pedro 39' (Pen)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky top-16 z-20 bg-[#0B0E14]/95 backdrop-blur py-2 border-b border-[#222B3A] flex items-center gap-1.5 overflow-x-auto">
                {[
                  'All Markets',
                  'Popular',
                  'Goals',
                  'Halves',
                  'Handicaps',
                  'Goalscorers',
                  'Corners & cards',
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMatchMarketTab(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      matchMarketTab === cat
                        ? 'bg-[#00E701] text-[#0B0E14] shadow-sm'
                        : 'bg-[#181F2C] text-slate-300 hover:text-white border border-[#222B3A]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-3.5">
                {displayedMatchMarkets
                  .filter((m) => matchMarketTab === 'All Markets' || m.category === matchMarketTab)
                  .map((market) => {
                    const isCollapsed = collapsedMarkets.includes(market.id);
                    return (
                      <div
                        key={market.id}
                        className="bg-[#181F2C] border border-[#222B3A] rounded-xl overflow-hidden"
                      >
                        <div
                          onClick={() => toggleMarketCollapse(market.id)}
                          className="px-4 py-3 bg-[#141A25] hover:bg-[#192130] border-b border-[#222B3A] flex items-center justify-between cursor-pointer select-none transition"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {market.title}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#1F293A] text-slate-400 font-mono text-[10px]">
                              {market.category}
                            </span>
                            {market.suspended && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold uppercase">
                                <Lock className="w-3 h-3" /> Market Suspended
                              </span>
                            )}
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                              isCollapsed ? '-rotate-90' : 'rotate-0'
                            }`}
                          />
                        </div>

                        {!isCollapsed && (
                          <div
                            className={`p-3.5 grid gap-2.5 ${
                              market.columns === 3
                                ? 'grid-cols-1 sm:grid-cols-3'
                                : 'grid-cols-1 sm:grid-cols-2'
                            }`}
                          >
                            {market.options.map((opt) => renderOddButton(opt))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {activePage === 'betslip-mobile' && (
            <div className="rounded-2xl border border-[#222B3A] overflow-hidden min-h-[540px]">
              {renderUnifiedBetSlipAndMyBets()}
            </div>
          )}
        </main>

        <aside className="hidden lg:block w-[350px] xl:w-[360px] shrink-0 border-l border-[#222B3A] bg-[#121721] sticky top-16 h-[calc(100vh-4rem)]">
          {renderUnifiedBetSlipAndMyBets()}
        </aside>
      </div>

      {/* MOBILE 390px STICKY BOTTOM BET SLIP BAR + DRAWER */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40">
        {mobileSlipOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 flex flex-col justify-end">
            <div className="bg-[#121721] border-t border-[#2E3A52] rounded-t-2xl h-[82vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 bg-[#0B0E14] border-b border-[#222B3A] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#00E701] uppercase tracking-wider">
                  Housebets Slip & My Bets
                </span>
                <button
                  onClick={() => setMobileSlipOpen(false)}
                  className="p-1.5 rounded-lg bg-[#181F2C] text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{renderUnifiedBetSlipAndMyBets()}</div>
            </div>
          </div>
        )}

        <div
          onClick={() => setMobileSlipOpen(!mobileSlipOpen)}
          className="bg-[#121721]/95 backdrop-blur-md border-t-2 border-[#00E701] px-4 py-3 flex items-center justify-between cursor-pointer shadow-[0_-8px_25px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#00E701] text-[#0B0E14] font-mono font-black text-xs flex items-center justify-center shrink-0">
              {selectedOdd ? '1' : openBetsCount}
            </div>
            <div className="min-w-0">
              {selectedOdd ? (
                <>
                  <div className="text-xs font-bold text-white truncate">
                    {selectedOdd.label}{' '}
                    <span className="font-mono text-[#00E701]">
                      @{selectedOdd.odds.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {selectedOdd.marketName} • Stake: {stake || 0} USDT
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs font-bold text-white">Bet Slip & My Bets</div>
                  <div className="text-[10px] text-slate-400">
                    {openBetsCount} Open Bets • Tap to open slip
                  </div>
                </>
              )}
            </div>
          </div>

          <button className="px-3.5 py-2 rounded-xl bg-[#00E701] text-[#0B0E14] font-extrabold text-xs shrink-0">
            {mobileSlipOpen ? 'Hide Slip' : selectedOdd ? 'Place Bet' : 'Open Bets'}
          </button>
        </div>
      </div>
    </div>
  );
}
