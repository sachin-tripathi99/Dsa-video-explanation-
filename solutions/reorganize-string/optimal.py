from collections import Counter

class Solution:
    def reorganizeString(self, s: str) -> str:
        n, cnt = len(s), Counter(s)
        order = sorted(cnt, key=lambda c: -cnt[c])        # most frequent first
        if cnt[order[0]] > (n + 1) // 2:
            return ""                           # cannot fit on even slots
        out, i = [""] * n, 0
        for ch in order:
            for _ in range(cnt[ch]):
                if i >= n:
                    i = 1                       # wrap to odd slots
                out[i] = ch
                i += 2
        return "".join(out)
