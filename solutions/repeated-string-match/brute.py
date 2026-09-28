class Solution:
    def repeatedStringMatch(self, a: str, b: str) -> int:
        t, k = "", 0
        while len(t) <= len(b) + 2 * len(a):
            t += a                              # k copies of a
            k += 1
            if b in t:
                return k
        return -1
