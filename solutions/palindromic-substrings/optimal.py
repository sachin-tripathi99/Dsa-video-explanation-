class Solution:
    def countSubstrings(self, s: str) -> int:
        n, count = len(s), 0
        for c in range(2 * n - 1):              # letters and gaps
            l, r = c // 2, c // 2 + c % 2
            while l >= 0 and r < n and s[l] == s[r]:
                count += 1
                l, r = l - 1, r + 1
        return count
