class Solution:
    def longestWord(self, words: List[str]) -> str:
        s = set(words)
        best = ""
        for w in words:
            if all(w[:i] in s for i in range(1, len(w))):     # every prefix
                if len(w) > len(best) or (len(w) == len(best) and w < best):
                    best = w
        return best
