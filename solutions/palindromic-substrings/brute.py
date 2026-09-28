class Solution:
    def countSubstrings(self, s: str) -> int:
        n = len(s)
        return sum(1 for i in range(n) for j in range(i, n) if s[i:j + 1] == s[i:j + 1][::-1])
