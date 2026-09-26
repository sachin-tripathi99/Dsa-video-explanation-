class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        if len(hand) % groupSize:
            return False
        cards = sorted(hand)
        while cards:
            x = cards[0]
            for d in range(groupSize):
                if x + d not in cards:
                    return False
                cards.remove(x + d)             # O(n) search + removal
        return True
