class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter(t)
        best = ""
        for i in range(len(s)):
            have = Counter()
            for j in range(i, len(s)):
                have[s[j]] += 1
                if all(have[c] >= k for c, k in need.items()):
                    if not best or j - i + 1 < len(best):
                        best = s[i:j + 1]
                    break
        return best
