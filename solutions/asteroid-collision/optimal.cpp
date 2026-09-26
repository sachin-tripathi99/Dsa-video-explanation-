class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        vector<int> st;                                    // survivors; back = rightmost
        for (int x : asteroids) {
            bool alive = true;
            while (alive && x < 0 && !st.empty() && st.back() > 0) {
                if (st.back() < -x) st.pop_back();         // top explodes; x keeps going
                else {
                    if (st.back() == -x) st.pop_back();    // both explode
                    alive = false;
                }
            }
            if (alive) st.push_back(x);
        }
        return st;
    }
};
