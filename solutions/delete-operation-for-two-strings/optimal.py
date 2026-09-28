class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        n = len(word2)
        prev = [0] * (n + 1)                    # LCS rows
        for a in word1:
            cur = [0] * (n + 1)
            for j in range(1, n + 1):
                cur[j] = prev[j - 1] + 1 if a == word2[j - 1] else max(prev[j], cur[j - 1])
            prev = cur
        return len(word1) + n - 2 * prev[n]     # delete everything outside the LCS
