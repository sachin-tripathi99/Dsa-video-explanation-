class Solution:
    def longestStrChain(self, words: List[str]) -> int:
        best = {}
        for w in sorted(words, key=len):        # predecessors first
            best[w] = 1 + max((best.get(w[:i] + w[i + 1:], 0) for i in range(len(w))), default=0)   # delete one letter
        return max(best.values())
