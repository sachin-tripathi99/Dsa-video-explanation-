class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        window = set()
        l = best = 0
        for r, c in enumerate(s):
            while c in window:
                window.remove(s[l])
                l += 1
            window.add(c)
            best = max(best, r - l + 1)
        return best
