class Solution {
public:
    int findMinArrowShots(vector<vector<int>>& points) {
        int n = points.size(), arrows = 0;
        vector<bool> burst(n, false);
        while (true) {
            int b = -1;
            for (int i = 0; i < n; i++)                       // intact balloon ending first
                if (!burst[i] && (b == -1 || points[i][1] < points[b][1])) b = i;
            if (b == -1) return arrows;
            arrows++;
            int x = points[b][1];
            for (int i = 0; i < n; i++)
                if (points[i][0] <= x && x <= points[i][1]) burst[i] = true;
        }
    }
};
