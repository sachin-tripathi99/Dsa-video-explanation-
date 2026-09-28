class Solution:
    def maxProbability(self, n: int, edges: List[List[int]], succProb: List[float], start_node: int, end_node: int) -> float:
        prob = [0.0] * n
        prob[start_node] = 1.0
        for _ in range(n - 1):                  # n − 1 passes
            changed = False
            for (a, b), p in zip(edges, succProb):
                if prob[a] * p > prob[b]:
                    prob[b] = prob[a] * p
                    changed = True
                if prob[b] * p > prob[a]:
                    prob[a] = prob[b] * p
                    changed = True
            if not changed:
                break
        return prob[end_node]
