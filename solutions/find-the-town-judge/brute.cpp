class Solution {
public:
    int findJudge(int n, vector<vector<int>>& trust) {
        for (int p = 1; p <= n; p++) {
            bool trustsSomeone = false;
            int trustedBy = 0;
            for (auto& t : trust) {
                if (t[0] == p) trustsSomeone = true;
                if (t[1] == p) trustedBy++;
            }
            if (!trustsSomeone && trustedBy == n - 1) return p;
        }
        return -1;
    }
};
