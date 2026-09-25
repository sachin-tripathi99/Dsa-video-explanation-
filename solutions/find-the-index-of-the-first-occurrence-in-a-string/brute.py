class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        n, m = len(haystack), len(needle)
        for s in range(n - m + 1):
            j = 0
            while j < m and haystack[s + j] == needle[j]:
                j += 1
            if j == m:
                return s
        return -1
