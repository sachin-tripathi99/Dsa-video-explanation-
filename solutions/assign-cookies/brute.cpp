class Solution {
public:
    int findContentChildren(vector<int>& g, vector<int>& s) {
        sort(g.begin(), g.end());
        vector<bool> used(s.size(), false);
        int content = 0;
        for (int greed : g) {
            int best = -1;
            for (int j = 0; j < (int)s.size(); j++)         // smallest unused cookie that fits
                if (!used[j] && s[j] >= greed && (best == -1 || s[j] < s[best])) best = j;
            if (best != -1) { used[best] = true; content++; }
        }
        return content;
    }
};
