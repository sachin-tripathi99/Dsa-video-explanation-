class Solution:
    def wordPattern(self, pattern: str, s: str) -> bool:
        w = s.split()
        n = len(pattern)
        if len(w) != n:
            return False
        for i in range(n):
            for j in range(i + 1, n):
                if (pattern[i] == pattern[j]) != (w[i] == w[j]):
                    return False
        return True
