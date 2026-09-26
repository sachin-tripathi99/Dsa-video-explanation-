class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = Counter()
        l = maxf = best = 0
        for r, c in enumerate(s):
            count[c] += 1
            maxf = max(maxf, count[c])
            while r - l + 1 - maxf > k:         # too many changes needed
                count[s[l]] -= 1
                l += 1
            best = max(best, r - l + 1)
        return best
