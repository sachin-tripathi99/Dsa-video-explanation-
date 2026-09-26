class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last = {}
        l = best = 0
        for r, c in enumerate(s):
            if last.get(c, -1) >= l:
                l = last[c] + 1                 # repeat inside the window: jump past it
            last[c] = r
            best = max(best, r - l + 1)
        return best
