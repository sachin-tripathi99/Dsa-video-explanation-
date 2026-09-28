class Solution {
    vector<TreeNode*> nodes;
    unordered_map<TreeNode*, TreeNode*> parent;
    void collect(TreeNode* x, TreeNode* p) {
        if (!x) return;
        nodes.push_back(x);
        parent[x] = p;
        collect(x->left, x);
        collect(x->right, x);
    }
public:
    int minCameraCover(TreeNode* root) {
        collect(root, nullptr);
        int n = nodes.size(), best = n;
        for (int mask = 0; mask < (1 << n); mask++) {       // every set of camera nodes
            int k = __builtin_popcount(mask);
            if (k >= best) continue;
            unordered_set<TreeNode*> seen;
            for (int i = 0; i < n; i++) if (mask >> i & 1) {
                TreeNode* x = nodes[i];
                for (TreeNode* y : {x, parent[x], x->left, x->right}) if (y) seen.insert(y);
            }
            if ((int)seen.size() == n) best = k;
        }
        return best;
    }
};
