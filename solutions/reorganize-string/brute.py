from collections import Counter

class Solution:
    def reorganizeString(self, s: str) -> str:
        cnt, out = Counter(s), []

        def place() -> bool:
            if len(out) == len(s):
                return True
            for c in list(cnt):
                if cnt[c] == 0 or (out and out[-1] == c):
                    continue
                cnt[c] -= 1
                out.append(c)
                if place():
                    return True
                out.pop()                       # undo
                cnt[c] += 1
            return False

        return "".join(out) if place() else ""
