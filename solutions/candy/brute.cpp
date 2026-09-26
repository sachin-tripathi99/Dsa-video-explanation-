class Solution {
public:
    int candy(vector<int>& ratings) {
        int n = ratings.size();
        vector<int> c(n, 1);
        bool changed = true;
        while (changed) {                                   // sweep until stable
            changed = false;
            for (int i = 0; i < n; i++) {
                if (i > 0 && ratings[i] > ratings[i - 1] && c[i] <= c[i - 1]) { c[i] = c[i - 1] + 1; changed = true; }
                if (i + 1 < n && ratings[i] > ratings[i + 1] && c[i] <= c[i + 1]) { c[i] = c[i + 1] + 1; changed = true; }
            }
        }
        return accumulate(c.begin(), c.end(), 0);
    }
};
