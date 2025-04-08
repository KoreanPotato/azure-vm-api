import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(MaterialApp(
    home: VmManager(),
    debugShowCheckedModeBanner: false,
  ));
}

class VmManager extends StatefulWidget {
  @override
  State<VmManager> createState() => _VmManagerState();
}

class _VmManagerState extends State<VmManager> {
  final String apiBaseUrl = 'http://localhost:8000/api/azure/vm';
  final String dbBaseUrl = 'http://localhost:8000/api/db';

  final TextEditingController vmNameController = TextEditingController();
  final TextEditingController sshKeyController = TextEditingController();

  List<dynamic> vms = [];

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> fetchAllVMs() async {
    try {
      final response = await http.get(Uri.parse('$dbBaseUrl/all'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          vms = data;
        });
      } else {
        _showSnackBar('Ошибка загрузки ВМ: ${response.statusCode}');
      }
    } catch (e) {
      _showSnackBar('Ошибка сети: $e');
    }
  }

  Future<void> createVm() async {
    try {
      final response = await http.post(
        Uri.parse('$apiBaseUrl/create'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'vmName': vmNameController.text,
          'sshKey': sshKeyController.text,
        }),
      );
      if (response.statusCode == 201) {
        _showSnackBar('ВМ создана успешно!');
        await fetchAllVMs();
      } else {
        _showSnackBar('Ошибка: ${response.statusCode}\n${response.body}');
      }
    } catch (e) {
      _showSnackBar('Сетевая ошибка: $e');
    }
  }

  Future<void> deleteVm() async {
    try {
      final response = await http.post(
        Uri.parse('$apiBaseUrl/terminate'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'vmName': vmNameController.text}),
      );
      if (response.statusCode == 201) {
        _showSnackBar('ВМ удалена успешно!');
        await fetchAllVMs();
      } else {
        _showSnackBar('Ошибка: ${response.statusCode}\n${response.body}');
      }
    } catch (e) {
      _showSnackBar('Сетевая ошибка: $e');
    }
  }

  void showCreateDialog(BuildContext context) {
    vmNameController.clear();
    sshKeyController.clear();

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Создать ВМ'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: vmNameController,
              decoration: InputDecoration(labelText: 'VM Name'),
            ),
            SizedBox(height: 10),
            TextField(
              controller: sshKeyController,
              maxLines: 3,
              decoration: InputDecoration(labelText: 'SSH Public Key'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await createVm();
            },
            child: Text('Создать'),
          ),
        ],
      ),
    );
  }

  void showDeleteDialog(BuildContext context) {
    vmNameController.clear();
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Удалить ВМ'),
        content: TextField(
          controller: vmNameController,
          decoration: InputDecoration(labelText: 'VM Name'),
        ),
        actions: [
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await deleteVm();
            },
            child: Text('Удалить'),
          ),
        ],
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    fetchAllVMs(); 
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Azure VM Manager')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: () => showCreateDialog(context),
              child: Text('Create Instance'),
            ),
            SizedBox(height: 10),
            ElevatedButton(
              onPressed: () => showDeleteDialog(context),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              child: Text('Delete Instance'),
            ),
            SizedBox(height: 30),
            Text('Виртуальные машины из базы:', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            SizedBox(height: 10),
            Expanded(
              child: vms.isEmpty
                  ? Center(child: Text('Нет виртуальных машин'))
                  : ListView.builder(
                      itemCount: vms.length,
                      itemBuilder: (context, index) {
                        final vm = vms[index];
                        return ListTile(
                          leading: Icon(Icons.cloud),
                          title: Text('${vm['vmName']}'),
                          subtitle: Text('ID: ${vm['vmId']}'),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
