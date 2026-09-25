class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        n, m = len(haystack), len(needle)
        lps = [0] * m                                # longest proper prefix that is also a suffix
        length, i = 0, 1
        while i < m:
            if needle[i] == needle[length]:
                length += 1
                lps[i] = length
                i += 1
            elif length:
                length = lps[length - 1]
            else:
                i += 1
        i = j = 0
        while i < n:
            if haystack[i] == needle[j]:
                i += 1
                j += 1
                if j == m:
                    return i - m
            elif j:
                j = lps[j - 1]                       # reuse the matched prefix; i stays
            else:
                i += 1
        return -1
