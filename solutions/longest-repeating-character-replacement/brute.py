class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        best = 0
        for i in range(len(s)):
            count = Counter()
            maxf = 0
            for j in range(i, len(s)):
                count[s[j]] += 1
                maxf = max(maxf, count[s[j]])
                if j - i + 1 - maxf <= k:
                    best = max(best, j - i + 1)
        return best
