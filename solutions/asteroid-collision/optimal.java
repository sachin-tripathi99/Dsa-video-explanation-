class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Deque<Integer> st = new ArrayDeque<>();            // survivors; top = rightmost
        for (int x : asteroids) {
            boolean alive = true;
            while (alive && x < 0 && !st.isEmpty() && st.peek() > 0) {
                int top = st.peek();
                if (top < -x) st.pop();                    // top explodes; x keeps going
                else {
                    if (top == -x) st.pop();               // both explode
                    alive = false;
                }
            }
            if (alive) st.push(x);
        }
        int[] out = new int[st.size()];
        for (int i = out.length - 1; i >= 0; i--) out[i] = st.pop();
        return out;
    }
}
