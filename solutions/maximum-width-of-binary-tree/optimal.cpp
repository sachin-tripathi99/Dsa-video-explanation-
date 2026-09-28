class Solution {
public:
    int widthOfBinaryTree(TreeNode* root) {
        queue<pair<TreeNode*, unsigned long long>> q;        // (node, position)
        q.push({root, 0});
        unsigned long long best = 0;
        while (!q.empty()) {
            int size = q.size();
            unsigned long long base = q.front().second, last = 0;
            for (int i = 0; i < size; i++) {
                auto [n, p0] = q.front(); q.pop();
                unsigned long long p = p0 - base;           // normalise to avoid overflow
                last = p;
                if (n->left) q.push({n->left, 2 * p});
                if (n->right) q.push({n->right, 2 * p + 1});
            }
            best = max(best, last + 1);
        }
        return (int)best;
    }
};
