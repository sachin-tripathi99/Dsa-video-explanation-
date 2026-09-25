class Solution:
    def backspaceCompare(self, s: str, t: str) -> bool:
        def back(x: str, i: int) -> int:                 # next real char at or before i
            skip = 0
            while i >= 0:
                if x[i] == "#":
                    skip += 1
                elif skip:
                    skip -= 1
                else:
                    break
                i -= 1
            return i

        i, j = len(s) - 1, len(t) - 1
        while True:
            i, j = back(s, i), back(t, j)
            if i < 0 or j < 0:
                return i < 0 and j < 0                   # both must run out together
            if s[i] != t[j]:
                return False
            i -= 1
            j -= 1
