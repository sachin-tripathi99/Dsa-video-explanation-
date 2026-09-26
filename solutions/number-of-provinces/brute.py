class Solution:
    def findCircleNum(self, isConnected: List[List[int]]) -> int:
        n = len(isConnected)
        group = list(range(n))
        for i in range(n):
            for j in range(i + 1, n):
                if isConnected[i][j] and group[i] != group[j]:
                    old, now = group[j], group[i]
                    for k in range(n):            # O(n) relabel
                        if group[k] == old:
                            group[k] = now
        return len(set(group))
