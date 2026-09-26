class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        vector<int> a = asteroids;
        bool changed = true;
        while (changed) {
            changed = false;
            for (size_t i = 0; i + 1 < a.size(); i++) {
                int l = a[i], r = a[i + 1];
                if (l > 0 && r < 0) {                        // they meet
                    if (l > -r) a.erase(a.begin() + i + 1);
                    else if (l < -r) a.erase(a.begin() + i);
                    else a.erase(a.begin() + i, a.begin() + i + 2);
                    changed = true;
                    break;
                }
            }
        }
        return a;
    }
};
