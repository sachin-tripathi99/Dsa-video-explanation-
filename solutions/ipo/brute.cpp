class Solution {
public:
    int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {
        int n = profits.size();
        vector<bool> used(n, false);
        for (int r = 0; r < k; r++) {
            int best = -1;
            for (int i = 0; i < n; i++)
                if (!used[i] && capital[i] <= w && (best == -1 || profits[i] > profits[best])) best = i;
            if (best == -1) break;                          // nothing affordable
            used[best] = true;
            w += profits[best];
        }
        return w;
    }
};
