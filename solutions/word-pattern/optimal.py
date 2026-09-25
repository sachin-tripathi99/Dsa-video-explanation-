class Solution:
    def wordPattern(self, pattern: str, s: str) -> bool:
        words = s.split()
        if len(words) != len(pattern):
            return False
        pw, wp = {}, {}
        for c, w in zip(pattern, words):
            if pw.get(c, w) != w or wp.get(w, c) != c:   # conflict in either direction
                return False
            pw[c] = w
            wp[w] = c
        return True
