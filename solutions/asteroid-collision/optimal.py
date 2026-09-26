class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        st = []                                 # survivors; top = rightmost
        for x in asteroids:
            alive = True
            while alive and x < 0 and st and st[-1] > 0:
                if st[-1] < -x:
                    st.pop()                    # top explodes; x keeps going
                else:
                    if st[-1] == -x:
                        st.pop()                # both explode
                    alive = False
            if alive:
                st.append(x)
        return st
