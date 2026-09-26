class Solution:
    def findCircleNum(self, isConnected: List[List[int]]) -> int:
        n = len(isConnected)
        seen = [False] * n
        provinces = 0
        for c in range(n):
            if seen[c]:
                continue
            provinces += 1
            seen[c] = True
            stack = [c]
            while stack:
                x = stack.pop()
                for j in range(n):
                    if isConnected[x][j] and not seen[j]:
                        seen[j] = True
                        stack.append(j)
        return provinces
