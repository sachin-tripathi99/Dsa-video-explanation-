class Solution:
    def longestValidParentheses(self, s: str) -> int:
        st = [-1]                               # base: index before the current run
        best = 0
        for i, c in enumerate(s):
            if c == "(":
                st.append(i)
            else:
                st.pop()
                if not st:
                    st.append(i)                # unmatched ")" is the new base
                else:
                    best = max(best, i - st[-1])
        return best
