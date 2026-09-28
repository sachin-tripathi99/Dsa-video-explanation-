class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        vector<int> out;
        queue<TreeNode*> q;
        if (root) q.push(root);
        while (!q.empty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                TreeNode* n = q.front(); q.pop();
                if (i == size - 1) out.push_back(n->val);   // last on this level
                if (n->left) q.push(n->left);
                if (n->right) q.push(n->right);
            }
        }
        return out;
    }
};
