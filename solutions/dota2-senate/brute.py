class Solution:
    def predictPartyVictory(self, senate: str) -> str:
        s = list(senate)
        while True:
            if "R" not in s:
                return "Dire"
            if "D" not in s:
                return "Radiant"
            i = 0
            while i < len(s):
                me = s[i]
                j = (i + 1) % len(s)
                while s[j] == me:                        # next opponent after me
                    j = (j + 1) % len(s)
                s.pop(j)
                if j < i:
                    i -= 1                               # removal shifted my index
                if ("D" if me == "R" else "R") not in s:
                    break
                i += 1
