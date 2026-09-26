class Solution:
    def maximalRectangle(self, matrix: List[List[str]]) -> int:
        def largest(h):                         # Largest Rectangle in Histogram
            st, best = [], 0
            for i, x in enumerate(h + [0]):
                while st and h[st[-1]] > x:
                    t = st.pop()
                    left = st[-1] if st else -1
                    best = max(best, h[t] * (i - left - 1))
                st.append(i)
            return best

        h = [0] * len(matrix[0])
        best = 0
        for row in matrix:
            h = [h[j] + 1 if c == "1" else 0 for j, c in enumerate(row)]   # histogram for this row
            best = max(best, largest(h))
        return best
