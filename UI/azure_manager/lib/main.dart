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
  final String apiBaseUrl = 'http://localhost:3001/api/azure/vm';

  final TextEditingController vmNameController = TextEditingController();
  final TextEditingController sshKeyController = TextEditingController();

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  Future<void> createEC2() async {
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
      } else {
        _showSnackBar('Ошибка: ${response.statusCode}\n${response.body}');
      }
    } catch (e) {
      _showSnackBar('Сетевая ошибка: $e');
    }
  }

  Future<void> deleteEC2() async {
    try {
      final response = await http.post(
        Uri.parse('$apiBaseUrl/terminate'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'vmName': vmNameController.text,
        }),
      );

      if (response.statusCode == 201) {
        _showSnackBar('ВМ удалена успешно!');
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
              await createEC2();
            },
            child: Text('Create'),
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
              await deleteEC2();
            },
            child: Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Azure VM Manager')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                onPressed: () => showCreateDialog(context),
                child: Text('Create Instance'),
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => showDeleteDialog(context),
                child: Text('Delete Instance'),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
