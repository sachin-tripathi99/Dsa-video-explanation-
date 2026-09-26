from collections import Counter

class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        if len(hand) % groupSize:
            return False
        cnt = Counter(hand)
        for x in sorted(cnt):                   # increasing order
            m = cnt[x]
            if m == 0:
                continue
            for d in range(groupSize):          # m groups start at x
                if cnt[x + d] < m:
                    return False
                cnt[x + d] -= m
        return True
