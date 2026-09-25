class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        st = []
        for tok in tokens:
            if tok in ("+", "-", "*", "/"):
                b, a = st.pop(), st.pop()            # b is the right operand
                if tok == "+":
                    st.append(a + b)
                elif tok == "-":
                    st.append(a - b)
                elif tok == "*":
                    st.append(a * b)
                else:
                    st.append(int(a / b))            # truncate toward zero
            else:
                st.append(int(tok))
        return st.pop()
