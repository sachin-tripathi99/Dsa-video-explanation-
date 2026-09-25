from collections import deque

class Solution:
    def predictPartyVictory(self, senate: str) -> str:
        n = len(senate)
        r = deque(i for i, c in enumerate(senate) if c == "R")
        d = deque(i for i, c in enumerate(senate) if c == "D")
        while r and d:
            a, b = r.popleft(), d.popleft()
            if a < b:
                r.append(a + n)                 # R votes first, bans D, votes again next round
            else:
                d.append(b + n)
        return "Radiant" if r else "Dire"
