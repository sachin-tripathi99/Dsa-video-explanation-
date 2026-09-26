class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        s = num
        for _ in range(k):
            i = 0
            while i + 1 < len(s) and s[i] <= s[i + 1]:
                i += 1                          # first peak
            s = s[:i] + s[i + 1:]
        return s.lstrip("0") or "0"
