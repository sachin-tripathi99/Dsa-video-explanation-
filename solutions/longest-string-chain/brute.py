class Solution:
    def longestStrChain(self, words: List[str]) -> int:
        have = set(words)

        def grow(w):                            # longest chain starting at w
            best = 1
            for i in range(len(w) + 1):
                for c in "abcdefghijklmnopqrstuvwxyz":
                    nxt = w[:i] + c + w[i:]
                    if nxt in have:
                        best = max(best, 1 + grow(nxt))
            return best

        return max(grow(w) for w in words)      # start anywhere
