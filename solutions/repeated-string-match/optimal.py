class Solution:
    def repeatedStringMatch(self, a: str, b: str) -> int:
        m = len(b)
        q = -(-m // len(a))
        t = a * (q + 1)                         # b must start in the first copy
        lps, length = [0] * m, 0
        for i in range(1, m):
            while length and b[i] != b[length]:
                length = lps[length - 1]
            if b[i] == b[length]:
                length += 1
            lps[i] = length
        j = 0
        for i, c in enumerate(t):
            while j and c != b[j]:
                j = lps[j - 1]
            if c == b[j]:
                j += 1
            if j == m:
                return -(-(i + 1) // len(a))    # copies needed to reach index i
        return -1
