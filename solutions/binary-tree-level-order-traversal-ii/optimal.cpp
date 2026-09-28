class Solution {
public:
    vector<vector<int>> levelOrderBottom(TreeNode* root) {
        vector<vector<int>> out;
        queue<TreeNode*> q;
        if (root) q.push(root);
        while (!q.empty()) {
            vector<int> level;
            for (int i = q.size(); i > 0; i--) {
                TreeNode* n = q.front(); q.pop();
                level.push_back(n->val);
                if (n->left) q.push(n->left);
                if (n->right) q.push(n->right);
            }
            out.push_back(level);
        }
        reverse(out.begin(), out.end());                    // bottom level first
        return out;
    }
};
