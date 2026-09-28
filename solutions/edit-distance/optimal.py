class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        n = len(word2)
        prev = list(range(n + 1))               # from "" : j inserts
        for i, a in enumerate(word1, 1):
            cur = [i] + [0] * n                 # to "" : i deletes
            for j in range(1, n + 1):
                if a == word2[j - 1]:
                    cur[j] = prev[j - 1]
                else:
                    cur[j] = 1 + min(prev[j - 1], prev[j], cur[j - 1])   # replace / delete / insert
            prev = cur
        return prev[n]
