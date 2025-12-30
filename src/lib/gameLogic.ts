export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  suit: Suit
  rank: Rank
  value: number
  id: string
}

export interface Hand {
  cards: Card[]
  total: number
  isSoft: boolean
  isBlackjack: boolean
  isBust: boolean
}

export type GameResult = 'win' | 'loss' | 'push'

export class BlackjackGame {
  private deck: Card[] = []
  private playerHand: Hand = { cards: [], total: 0, isSoft: false, isBlackjack: false, isBust: false }
  private dealerHand: Hand = { cards: [], total: 0, isSoft: false, isBlackjack: false, isBust: false }
  private gameState: 'betting' | 'playing' | 'dealer-turn' | 'finished' = 'betting'
  private bet: number = 0

  constructor() {
    this.createDeck()
  }

  private createDeck(): void {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
    const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    
    this.deck = []
    suits.forEach(suit => {
      ranks.forEach(rank => {
        const value = rank === 'A' ? 11 : rank === 'J' || rank === 'Q' || rank === 'K' ? 10 : parseInt(rank)
        this.deck.push({
          suit,
          rank,
          value,
          id: `${suit}-${rank}-${Math.random().toString(36).substr(2, 9)}`
        })
      })
    })
    this.shuffleDeck()
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
  }

  private calculateHandTotal(cards: Card[]): { total: number; isSoft: boolean } {
    let total = 0
    let aces = 0

    cards.forEach(card => {
      if (card.rank === 'A') {
        aces++
        total += 11
      } else {
        total += card.value
      }
    })

    // Adjust for aces
    while (total > 21 && aces > 0) {
      total -= 10
      aces--
    }

    return { total, isSoft: aces > 0 && total <= 21 }
  }

  private updateHand(hand: Hand): Hand {
    const { total, isSoft } = this.calculateHandTotal(hand.cards)
    const isBlackjack = hand.cards.length === 2 && total === 21
    const isBust = total > 21

    return {
      ...hand,
      total,
      isSoft,
      isBlackjack,
      isBust
    }
  }

  dealCard(_faceDown: boolean = false): Card {
    if (this.deck.length === 0) {
      this.createDeck()
    }
    return this.deck.pop()!
  }

  placeBet(amount: number, availableChips: number): boolean {
    if (this.gameState !== 'betting') return false
    if (amount <= 0 || amount > availableChips) return false
    
    this.bet = amount
    return true
  }

  startGame(): void {
    if (this.gameState !== 'betting' || this.bet === 0) return

    this.playerHand = { cards: [], total: 0, isSoft: false, isBlackjack: false, isBust: false }
    this.dealerHand = { cards: [], total: 0, isSoft: false, isBlackjack: false, isBust: false }

    // Deal initial cards
    this.playerHand.cards.push(this.dealCard())
    this.dealerHand.cards.push(this.dealCard())
    this.playerHand.cards.push(this.dealCard())
    this.dealerHand.cards.push(this.dealCard(true)) // Dealer's second card face down

    this.playerHand = this.updateHand(this.playerHand)
    this.dealerHand = this.updateHand(this.dealerHand)

    // Check for immediate blackjack
    if (this.playerHand.isBlackjack) {
      this.gameState = 'dealer-turn'
      this.dealerTurn()
    } else {
      this.gameState = 'playing'
    }
  }

  hit(): boolean {
    if (this.gameState !== 'playing') return false
    if (this.playerHand.isBust) return false

    this.playerHand.cards.push(this.dealCard())
    this.playerHand = this.updateHand(this.playerHand)

    if (this.playerHand.isBust) {
      this.gameState = 'finished'
    }

    return true
  }

  stand(): boolean {
    if (this.gameState !== 'playing') return false

    this.gameState = 'dealer-turn'
    this.dealerTurn()
    return true
  }

  private dealerTurn(): void {
    // Reveal dealer's face-down card
    if (this.dealerHand.cards.length === 2) {
      // Card is already dealt, just update visibility
    }

    // Dealer must hit on 16 or less, stand on 17+
    while (this.dealerHand.total < 17) {
      this.dealerHand.cards.push(this.dealCard())
      this.dealerHand = this.updateHand(this.dealerHand)
    }

    this.gameState = 'finished'
  }

  getResult(): GameResult | null {
    if (this.gameState !== 'finished') return null

    const playerTotal = this.playerHand.total
    const dealerTotal = this.dealerHand.total

    // Player busts
    if (this.playerHand.isBust) {
      return 'loss'
    }

    // Dealer busts
    if (this.dealerHand.isBust) {
      return 'win'
    }

    // Player blackjack beats dealer blackjack
    if (this.playerHand.isBlackjack && !this.dealerHand.isBlackjack) {
      return 'win'
    }

    // Dealer blackjack beats player
    if (this.dealerHand.isBlackjack && !this.playerHand.isBlackjack) {
      return 'loss'
    }

    // Compare totals
    if (playerTotal > dealerTotal) {
      return 'win'
    } else if (playerTotal < dealerTotal) {
      return 'loss'
    } else {
      return 'push'
    }
  }

  calculatePayout(result: GameResult): number {
    if (result === 'win') {
      // Blackjack pays 3:2, regular win pays 2:1
      return this.playerHand.isBlackjack ? Math.floor(this.bet * 2.5) : this.bet * 2
    } else if (result === 'push') {
      return this.bet
    } else {
      return 0
    }
  }

  reset(): void {
    this.playerHand = { cards: [], total: 0, isSoft: false, isBlackjack: false, isBust: false }
    this.dealerHand = { cards: [], total: 0, isSoft: false, isBlackjack: false, isBust: false }
    this.gameState = 'betting'
    this.bet = 0
    if (this.deck.length < 20) {
      this.createDeck()
    }
  }

  getPlayerHand(): Hand {
    return { ...this.playerHand }
  }

  getDealerHand(): Hand {
    return { ...this.dealerHand }
  }

  getGameState(): string {
    return this.gameState
  }

  getBet(): number {
    return this.bet
  }
}

