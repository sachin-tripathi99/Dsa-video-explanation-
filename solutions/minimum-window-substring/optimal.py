class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter(t)
        missing = len(t)
        l = best_l = 0
        best_len = float("inf")
        for r, c in enumerate(s):
            if need[c] > 0:
                missing -= 1                    # a character we still owed
            need[c] -= 1
            while missing == 0:                 # window covers t
                if r - l + 1 < best_len:
                    best_len, best_l = r - l + 1, l
                need[s[l]] += 1
                if need[s[l]] > 0:
                    missing += 1                # dropped a required character
                l += 1
        return "" if best_len == float("inf") else s[best_l:best_l + best_len]
