class Solution:
    def backspaceCompare(self, s: str, t: str) -> bool:
        def build(x: str) -> str:
            st = []
            for c in x:
                if c == "#":
                    if st:
                        st.pop()
                else:
                    st.append(c)
            return "".join(st)

        return build(s) == build(t)
